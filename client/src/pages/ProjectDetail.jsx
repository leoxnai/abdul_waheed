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

      <section className="relative pb-20 pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="mb-8 inline-flex items-center space-x-2 text-[#4B5563] transition-colors hover:text-primary"
          >
            <FiArrowLeft />
            <span>Back to Projects</span>
          </Link>

          {/* Hero Image */}
          <SectionReveal>
            <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-[2rem] border border-[#EFE5DA] bg-white shadow-[0_24px_70px_-40px_rgba(31,31,31,0.35)]">
              <div className="absolute inset-0 flex items-center justify-center text-[#4B5563]">
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
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  {project.category}
                </span>
                <h1 className="mt-2 mb-6 font-heading text-4xl font-bold text-[#1F1F1F] md:text-5xl">{project.title}</h1>
                <p className="mb-6 text-lg leading-8 text-[#4B5563]">{project.description}</p>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <div className="space-y-6">
                  {project.problem && (
                    <div>
                      <h3 className="mb-2 font-heading text-xl font-bold text-primary">The Problem</h3>
                      <p className="leading-8 text-[#4B5563]">{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div>
                      <h3 className="mb-2 font-heading text-xl font-bold text-primary">The Solution</h3>
                      <p className="leading-8 text-[#4B5563]">{project.solution}</p>
                    </div>
                  )}
                </div>
              </SectionReveal>

              {/* Project Images */}
              {project.project_images?.length > 0 && (
                <SectionReveal delay={0.2}>
                  <h3 className="mt-12 mb-6 font-heading text-2xl font-bold text-[#1F1F1F]">Gallery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.project_images.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="overflow-hidden rounded-[1.25rem] border border-[#EFE5DA] bg-white"
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
                  <div className="rounded-[1.5rem] border border-[#EFE5DA] bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(31,31,31,0.3)]">
                    <h3 className="mb-4 font-heading text-lg font-bold text-[#1F1F1F]">Project Details</h3>
                    <div className="space-y-4">
                      {project.client && (
                        <div className="flex items-center space-x-3 text-sm">
                          <FiUser className="text-primary" />
                          <span className="text-[#4B5563]">Client: </span>
                          <span>{project.client}</span>
                        </div>
                      )}
                      {project.duration && (
                        <div className="flex items-center space-x-3 text-sm">
                          <FiClock className="text-primary" />
                          <span className="text-[#4B5563]">Duration: </span>
                          <span>{project.duration}</span>
                        </div>
                      )}
                      {project.software && (
                        <div className="flex items-start space-x-3 text-sm">
                          <FiLayers className="text-primary mt-0.5" />
                          <div>
                            <span className="text-[#4B5563]">Software: </span>
                            <span>{project.software}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* External Links */}
                  {(project.project_url || project.case_study_url || project.github_url) && (
                    <div className="rounded-[1.5rem] border border-[#EFE5DA] bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(31,31,31,0.3)]">
                      <h3 className="mb-4 font-heading text-lg font-bold text-[#1F1F1F]">Project Links</h3>
                      <div className="space-y-3">
                        {project.project_url && (
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                            className="group flex w-full items-center space-x-3 rounded-2xl border border-primary/20 bg-[#FFF2E8] px-4 py-3 transition-all duration-300 hover:bg-[#FFE7D0]">
                            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                              <FiExternalLink className="text-background" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#1F1F1F] transition-colors group-hover:text-primary">Live Website</p>
                              <p className="truncate text-xs text-[#4B5563]">{project.project_url.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                        )}
                        {project.case_study_url && (
                          <a href={project.case_study_url} target="_blank" rel="noopener noreferrer"
                            className="group flex w-full items-center space-x-3 rounded-2xl border border-[#EFE5DA] bg-white px-4 py-3 transition-all duration-300 hover:border-primary/20 hover:bg-[#FFF2E8]">
                            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                              <FaBehance className="text-[#FFF8F2]" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#1F1F1F] transition-colors group-hover:text-primary">Case Study</p>
                              <p className="truncate text-xs text-[#4B5563]">{project.case_study_url.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                            className="group flex w-full items-center space-x-3 rounded-2xl border border-[#EFE5DA] bg-white px-4 py-3 transition-all duration-300 hover:border-primary/20 hover:bg-[#FFF2E8]">
                            <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center flex-shrink-0">
                              <FiGithub className="text-background" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#1F1F1F] transition-colors group-hover:text-primary">Repository</p>
                              <p className="truncate text-xs text-[#4B5563]">{project.github_url.replace(/^https?:\/\//, '')}</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {project.before_after && (
                    <div className="rounded-[1.5rem] border border-[#EFE5DA] bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(31,31,31,0.3)]">
                      <h3 className="mb-4 font-heading text-lg font-bold text-[#1F1F1F]">Before / After</h3>
                      <div className="space-y-3">
                        {project.before_after.map((item, i) => (
                          <div key={i} className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg overflow-hidden">
                              <img src={item.before} alt="Before" className="w-full" loading="lazy" />
                              <p className="mt-1 text-center text-xs text-[#4B5563]">Before</p>
                            </div>
                            <div className="rounded-lg overflow-hidden">
                              <img src={item.after} alt="After" className="w-full" loading="lazy" />
                              <p className="mt-1 text-center text-xs text-[#4B5563]">After</p>
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
