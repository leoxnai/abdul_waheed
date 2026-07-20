import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

const defaultSectionTitles = {
  featured_projects: 'Featured Projects',
  services: 'Services & Expertise',
  testimonials: 'What Clients Say',
  cta_title: "Let's Create Something Amazing",
  cta_subtitle: 'Ready to elevate your brand?'
}

export default function AdminSettings() {
  const [form, setForm] = useState({
    site_name: 'Abdul Waheed',
    site_description: '',
    contact_email: '',
    phone: '',
    address: '',
    whatsapp: '',
    copyright_text: '',
    logo_text: 'AW',
    logo_image_url: '',
    section_titles: JSON.stringify(defaultSectionTitles),
  })
  const [loading, setLoading] = useState(false)
  const [settingsId, setSettingsId] = useState(null)

  const getSectionTitles = () => {
    try {
      return typeof form.section_titles === 'string'
        ? JSON.parse(form.section_titles)
        : form.section_titles
    } catch { return defaultSectionTitles }
  }

  const updateSectionTitle = (key, value) => {
    const current = getSectionTitles()
    setForm({ ...form, section_titles: JSON.stringify({ ...current, [key]: value }) })
  }

  const sectionTitleFields = ['featured_projects', 'services', 'testimonials', 'cta_title', 'cta_subtitle']

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle()
    if (data) {
      setSettingsId(data.id)
      setForm({
        site_name: data.site_name || 'Abdul Waheed',
        site_description: data.site_description || '',
        contact_email: data.contact_email || '',
        phone: data.phone || '',
        address: data.address || '',
        whatsapp: data.whatsapp || '',
        copyright_text: data.copyright_text || '',
        logo_text: data.logo_text || 'AW',
        logo_image_url: data.logo_image_url || '',
        section_titles: data.section_titles ? JSON.stringify(data.section_titles) : JSON.stringify(defaultSectionTitles),
      })
    } else if (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        id: settingsId || undefined,
        site_name: form.site_name,
        site_description: form.site_description,
        contact_email: form.contact_email,
        phone: form.phone,
        address: form.address,
        whatsapp: form.whatsapp,
        copyright_text: form.copyright_text,
        logo_text: form.logo_text,
        logo_image_url: form.logo_image_url,
        section_titles: getSectionTitles(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from('settings').upsert(payload).select()
      if (error) throw error
      if (data?.[0]?.id) setSettingsId(data[0].id)
      showToast('Settings saved!')
      refreshSite()
    } catch (err) {
      showToast('Error saving settings', 'error')
      console.error('Settings save error:', err)
    } finally { setLoading(false) }
  }

  const titles = getSectionTitles()

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">Site Settings</h2>
      <p className="text-sm mb-6 text-[#4B5563]">These values appear across your website — footer, contact page, homepage sections, and copyright.</p>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* Brand */}
        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Brand</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Site Name</label>
              <input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Site Description / Footer Bio</label>
              <textarea value={form.site_description} onChange={(e) => setForm({ ...form, site_description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937] resize-none" />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Copyright Text</label>
              <input value={form.copyright_text} onChange={(e) => setForm({ ...form, copyright_text: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Logo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Logo Text (shown if no image)</label>
              <input value={form.logo_text} onChange={(e) => setForm({ ...form, logo_text: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Logo Image URL (overrides text)</label>
              <input value={form.logo_image_url} onChange={(e) => setForm({ ...form, logo_image_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
              {form.logo_image_url && <img src={form.logo_image_url} alt="logo preview" className="mt-2 h-10 w-auto" />}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Contact Email</label>
              <input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} type="email" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
            </div>
            <div>
              <label className="block text-xs text-[#4B5563] mb-1">WhatsApp Number</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
            </div>
          </div>
        </div>

        {/* Section Titles */}
        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Homepage Section Titles</h3>
          <div className="space-y-4">
            {sectionTitleFields.map((key) => (
              <div key={key}>
                <label className="block text-xs text-[#4B5563] capitalize mb-1">{key.replace(/_/g, ' ')}</label>
                <input value={titles[key] || ''} onChange={(e) => updateSectionTitle(key, e.target.value)} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-[#1F2937]" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-primary text-background font-semibold rounded-xl hover:shadow-lg disabled:opacity-50">
          {loading ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  )
}
