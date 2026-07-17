import { Router } from 'express'
import Groq from 'groq-sdk'
import { config } from '../config/env.js'
import { supabase } from '../supabase/client.js'

const router = Router()
const groq = new Groq({ apiKey: config.groqApiKey })

const REAL_EMAIL = 'abdulwaheedgraphics097@gmail.com'
const REAL_PHONE = '+923291966097'
const REAL_WHATSAPP = '923291966097'

// ---------------------------------------------------------------------------
// TOOL DEFINITIONS — the LLM calls these to fetch live data from Supabase
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_portfolio_projects',
      description: 'Fetch published portfolio projects with their descriptions, categories, clients, tech stack, and live URLs. Use this when the user asks about projects, case studies, or portfolio work.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Optional category filter (e.g., "Branding", "Logo", "UI"). Leave empty to fetch all.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_services_and_expertise',
      description: 'Fetch all design services offered and skill levels. Use this when the user asks about services, what Abdul does, skills, or expertise.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_contact_and_about_info',
      description: 'Fetch Abdul Waheed\'s contact details, bio, location, social links, site description, and stats. Use this when the user asks for contact info, phone, email, location, or general information about Abdul.',
      parameters: { type: 'object', properties: {} },
    },
  },
]

// ---------------------------------------------------------------------------
// TOOL EXECUTORS — run the actual Supabase queries
// ---------------------------------------------------------------------------
const toolExecutors = {
  get_portfolio_projects: async (args) => {
    let query = supabase
      .from('projects')
      .select('title, description, category, client, duration, software, thumbnail_url, project_url, case_study_url, github_url')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (args?.category) {
      query = query.eq('category', args.category)
    }

    const { data, error } = await query
    if (error) return JSON.stringify({ error: error.message })
    return JSON.stringify({ projects: data || [] })
  },

  get_services_and_expertise: async () => {
    const [servicesRes, skillsRes] = await Promise.all([
      supabase.from('services').select('title, description, icon').eq('status', 'published').order('order'),
      supabase.from('skills').select('name, level, category').eq('active', true).order('name'),
    ])
    return JSON.stringify({
      services: servicesRes.data || [],
      skills: skillsRes.data || [],
    })
  },

  get_contact_and_about_info: async () => {
    const [settingsRes, socialRes, aboutRes, statsRes] = await Promise.all([
      supabase.from('settings').select('site_name, site_description, contact_email, phone, address, whatsapp').limit(1).maybeSingle(),
      supabase.from('social_links').select('platform, url').eq('active', true),
      supabase.from('about').select('bio, mission, vision').limit(1).maybeSingle(),
      supabase.from('stats').select('label, value, suffix').eq('active', true).order('order'),
    ])
    return JSON.stringify({
      name: 'Abdul Waheed',
      settings: settingsRes.data || {},
      social_links: socialRes.data || [],
      about: aboutRes.data || {},
      stats: statsRes.data || [],
    })
  },
}

// ---------------------------------------------------------------------------
// SYSTEM PROMPT — minimal behavioral instructions (data comes from tools)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are Abdul Waheed's official AI portfolio assistant. You have access to live database tools that fetch real-time information about Abdul's projects, services, skills, and contact details.

RULES:
1. ALWAYS use the tools to fetch data — never make up information
2. When a user asks about projects, portfolio, or case studies → call get_portfolio_projects
3. When a user asks about services, skills, or what Abdul does → call get_services_and_expertise
4. When a user asks for contact info, phone, email, location, or general info → call get_contact_and_about_info
5. Format your responses beautifully using Markdown: use bullet points for lists, **bold** for key phrases, and clean text formatting
6. When displaying project URLs, format them as friendly clickable text (e.g., "🔗 [View Live Project](url)") — never show raw URLs
7. If a tool returns no results for a specific filter (e.g., no projects in a category), politely say so — do not invent projects
8. Keep responses concise and professional (2-5 sentences typically, lists where appropriate)
9. Use emojis sparingly but appropriately
10. Be friendly, welcoming, and conversion-focused — the goal is to turn visitors into clients`

// ---------------------------------------------------------------------------
// LOCAL KEYWORD FALLBACK (fast path — no LLM call needed)
// ---------------------------------------------------------------------------
function getLocalAnswer(message) {
  const msg = message.toLowerCase()
  if (/phone|number|contact|whatsapp|call|reach/i.test(msg) && !/email/i.test(msg)) {
    return `Abdul Waheed's phone number is **${REAL_PHONE}**. You can also reach him on WhatsApp at wa.me/${REAL_WHATSAPP}.`
  }
  if (/email|mail/i.test(msg) && !/phone|number|whatsapp/i.test(msg)) {
    return `Abdul Waheed's email address is **${REAL_EMAIL}**.`
  }
  if ((/contact|reach|details|info/i.test(msg)) || (/email/i.test(msg) && /phone|number|whatsapp/i.test(msg))) {
    return `You can reach Abdul Waheed at:\n\n📧 Email: **${REAL_EMAIL}**\n📞 Phone: **${REAL_PHONE}**\n💬 WhatsApp: wa.me/${REAL_WHATSAPP}`
  }
  return null
}

// ---------------------------------------------------------------------------
// SAFE SUPABASE QUERY HELPER
// ---------------------------------------------------------------------------
async function safeQuery(queryFn) {
  try { return await queryFn() } catch { return null }
}

// ---------------------------------------------------------------------------
// AGENTIC CHAT LOOP
// ---------------------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'Message is required' })

    // Fast path: local keyword answer for basic contact questions
    const localAnswer = getLocalAnswer(message)
    if (localAnswer) return res.json({ reply: localAnswer })

    if (!config.groqApiKey) {
      return res.json({ reply: `Please email ${REAL_EMAIL} and Abdul will respond promptly.` })
    }

    // Fetch chatbot config (model, temperature, etc.)
    const chatbotCfg = await safeQuery(() =>
      supabase.from('chatbot_config').select('model, temperature, max_tokens, id').limit(1).maybeSingle()
    )

    let model = chatbotCfg?.data?.model || 'llama-3.3-70b-versatile'
    const temperature = chatbotCfg?.data?.temperature ?? 0.4
    const maxTokens = chatbotCfg?.data?.max_tokens || 600

    // Auto-fix decommissioned model silently
    if (model === 'mixtral-8x7b-32768') {
      model = 'llama-3.3-70b-versatile'
      safeQuery(() => supabase.from('chatbot_config').update({ model }).eq('id', chatbotCfg?.data?.id))
    }

    // -----------------------------------------------------------------------
    // STEP 1: Send user message + tool definitions to LLM
    // -----------------------------------------------------------------------
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ]

    const initialResponse = await groq.chat.completions.create({
      model,
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      temperature,
      max_tokens: maxTokens,
    })

    const choice = initialResponse.choices[0]
    const responseMessage = choice.message

    // -----------------------------------------------------------------------
    // STEP 2: Execute tool calls if the LLM requested them
    // -----------------------------------------------------------------------
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      // Add the assistant's tool-call message to the conversation
      messages.push(responseMessage)

      // Execute each tool call
      for (const toolCall of responseMessage.tool_calls) {
        const fnName = toolCall.function.name
        let fnArgs = {}

        try {
          fnArgs = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
        } catch { /* ignore parse errors */ }

        const executor = toolExecutors[fnName]
        const result = executor ? await executor(fnArgs) : JSON.stringify({ error: `Unknown tool: ${fnName}` })

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result,
        })
      }

      // -----------------------------------------------------------------------
      // STEP 3: Send conversation + tool results back to LLM for final answer
      // -----------------------------------------------------------------------
      const finalResponse = await groq.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      })

      const reply = finalResponse.choices[0]?.message?.content
      if (reply) return res.json({ reply })
    }

    // -----------------------------------------------------------------------
    // STEP 4: If no tool calls were made, use the direct response
    // -----------------------------------------------------------------------
    const directReply = responseMessage?.content
    if (directReply) return res.json({ reply: directReply })

    // Fallback
    res.json({ reply: `Please email ${REAL_EMAIL} and Abdul will be happy to help!` })
  } catch (error) {
    console.error('Chat error:', error.message)
    const fallback = getLocalAnswer(req.body?.message || '')
    res.json({ reply: fallback || `Please email ${REAL_EMAIL} and Abdul will be happy to help!` })
  }
})

export default router
