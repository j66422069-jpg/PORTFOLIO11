import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";

export default function ProjectList() {
  const { projects, fetchProjects, projectsLoaded } = useContent();
  const [selectedType, setSelectedType] = useState<'shoot' | 'edit'>('shoot');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = [...projects]
    .filter(p => {
      const type = p.project_type || 'shoot';
      return p.title && p.title.trim() !== "" && type === selectedType;
    })
    .sort((a, b) => {
      const orderA = a.sort_order && a.sort_order > 0 ? a.sort_order : 999999;
      const orderB = b.sort_order && b.sort_order > 0 ? b.sort_order : 999999;
      
      if (orderA !== orderB) return orderA - orderB;
      return (a.id || 0) - (b.id || 0);
    });

  console.log("project type filter", selectedType);
  console.log("projects by type", filteredProjects);

  if (!projectsLoaded && projects.length === 0) return <div className="max-w-7xl mx-auto px-6 py-20 text-black/20 font-bold tracking-widest uppercase">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-xs font-bold tracking-[0.3em] text-black/40 uppercase mb-4">
              Project Archive
            </h2>
            <h1 className="text-4xl font-bold tracking-tight">프로젝트 목록</h1>
          </div>

          {/* Type Switcher */}
          <div className="flex bg-black/5 p-1 rounded-lg">
            <button
              onClick={() => setSelectedType('shoot')}
              className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase transition-all rounded-md ${
                selectedType === 'shoot' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
              }`}
            >
              촬영 (SHOOT)
            </button>
            <button
              onClick={() => setSelectedType('edit')}
              className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase transition-all rounded-md ${
                selectedType === 'edit' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
              }`}
            >
              편집 (EDIT)
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/projects/${project.id}`} className="group block">
                    <div className="aspect-[16/9] overflow-hidden bg-black/5 mb-6 border border-black/5">
                      <img
                        src={project.thumbnailUrl || "https://picsum.photos/seed/project/800/450"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-black/60 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs font-bold text-black/20">{project.year}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-black/5 text-[10px] font-bold tracking-widest uppercase text-black/40">
                          {project.category || ""}
                        </span>
                        <span className="px-2 py-1 bg-black/5 text-[10px] font-bold tracking-widest uppercase text-black/40">
                          {project.role}
                        </span>
                      </div>
                      <p className="text-sm text-black/60 leading-relaxed line-clamp-2">
                        {project.summary}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm font-bold tracking-widest text-black/20 uppercase">
                  등록된 프로젝트가 없습니다.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
