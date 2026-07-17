import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowLeft, FiClock, FiUser, FiLayers, FiImage, FiExternalLink, FiGithub } from 'react-icons/fi'
import { FaBehance } from 'react-icons/fa'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { projects } = useApp()
  const project = projects?.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary hover:underline">Back to Projects</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Abdul Waheed</title>
      </Helmet>

      <section className="relative pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 text-gray hover:text-primary transition-colors mb-8"
          >
            <FiArrowLeft />
            <span>Back to Projects</span>
          </Link>

          {/* Hero Image */}
          <SectionReveal>
            <div className="relative rounded-2xl overflow-hidden mb-12 aspect-[21/9] bg-card">
              <div className="absolute inset-0 flex items-center justify-center text-gray">
                <div className="flex flex-col items-center space-y-2">
                  <FiImage size={40} />
                  <span className="text-sm">No image</span>
                </div>
              </div>
              {project.thumbnail_url && (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
            </div>
          </SectionReveal>

          {/* Project Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SectionReveal>
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mt-2 mb-6">{project.title}</h1>
                <p className="text-gray leading-relaxed mb-6">{project.description}</p>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <div className="space-y-6">
                  {project.problem && (
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2 text-primary">The Problem</h3>
                      <p className="text-gray leading-relaxed">{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-2 text-primary">The Solution</h3>
                      <p className="text-gray leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              </SectionReveal>

              {/* Project Images */}
              {project.project_images?.length > 0 && (
                <SectionReveal delay={0.2}>
                  <h3 className="text-2xl font-heading font-bold mt-12 mb-6">Gallery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.project_images.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-xl overflow-hidden bg-card"
                      >
                        <img src={img.url} alt={`${project.title} ${i + 1}`} className="w-full h-auto" loading="lazy" />
                      </motion.div>
                    ))}
                  </div>
                </SectionReveal>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <SectionReveal delay={0.2}>
                <div className="sticky top-28 space-y-6">
                  <div className="p-6 rounded-2xl bg-card border border-white/5">
                    <h3 className="font-heading font-bold mb-4">Project Details</h3>
                    <div className="space-y-4">
                      {project.client && (
                        <div className="flex items-center space-x-3 text-sm">
                          <FiUser className="text-primary" />
                          <span className="text-gray">Client: </span>
                          <span>{project.client}</span>
                        </div>
                      )}
                      {project.duration && (
                        <div className="flex items-center space-x-3 text-sm">
                          <FiClock className="text-primary" />
                          <span className="text-gray">Duration: </span>
                          <span>{project.duration}</span>
                        </div>
                      )}
                      {project.software && (
                        <div className="flex items-start space-x-3 text-sm">
                          <FiLayers className="text-primary mt-0.5" />
                          <div>
                            <span className="text-gray">Software: </span>
                            <span>{project.software}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* External Links */}
                  {(project.project_url || project.case_study_url || project.github_url) && (
                    <div className="p-6 rounded-2xl bg-card border border-white/5">
                      <h3 className="font-heading font-bold mb-4">Project Links</h3>
                      <div className="space-y-3">
                        {project.project_url && (
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl bg-gradient-primary/10 border border-primary/20 hover:bg-gradient-primary/20 transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                              <FiExternalLink className="text-background" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Live Website</p>
                              <p className="text-xs text-gray truncate">{project.project_url.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                        )}
                        {project.case_study_url && (
                          <a href={project.case_study_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <FaBehance className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Case Study</p>
                              <p className="text-xs text-gray truncate">{project.case_study_url.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20 transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center flex-shrink-0">
                              <FiGithub className="text-background" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white group-hover:text-gray-300 transition-colors">Repository</p>
                              <p className="text-xs text-gray truncate">{project.github_url.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {project.before_after && (
                    <div className="p-6 rounded-2xl bg-card border border-white/5">
                      <h3 className="font-heading font-bold mb-4">Before / After</h3>
                      <div className="space-y-3">
                        {project.before_after.map((item, i) => (
                          <div key={i} className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg overflow-hidden">
                              <img src={item.before} alt="Before" className="w-full" loading="lazy" />
                              <p className="text-xs text-gray text-center mt-1">Before</p>
                            </div>
                            <div className="rounded-lg overflow-hidden">
                              <img src={item.after} alt="After" className="w-full" loading="lazy" />
                              <p className="text-xs text-gray text-center mt-1">After</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
