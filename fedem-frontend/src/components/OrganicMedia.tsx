import { motion } from 'motion/react';
import { FEDEM_IMAGES } from '../lib/constants';

interface OrganicMediaProps {
  variant?: 'hero' | 'story';
  isDark: boolean;
}

export default function OrganicMedia({ variant = 'hero', isDark }: OrganicMediaProps) {
  const isStory = variant === 'story';
  const frame = isDark ? 'ring-white/10' : 'ring-white/80';

  return (
    <figure
      className={`relative mx-auto aspect-[1.04] w-full max-w-[590px] ${
        isStory ? 'max-w-[560px]' : ''
      }`}
      aria-label="Actions et équipe de la FEDEM Madagascar"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className={`absolute overflow-hidden ring-1 ${frame} shadow-2xl shadow-fedem-950/20 ${
          isStory
            ? 'left-[4%] top-[5%] h-[72%] w-[64%] shape-organic-main-alt'
            : 'right-[2%] top-[2%] h-[76%] w-[69%] shape-organic-main'
        }`}
      >
        <img
          src={isStory ? FEDEM_IMAGES.field : FEDEM_IMAGES.group}
          alt={isStory ? 'Activité agricole accompagnée par la FEDEM' : 'Équipe FEDEM Madagascar'}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute overflow-hidden ring-4 ${frame} shadow-xl ${
          isStory
            ? 'right-[4%] top-[11%] h-[35%] w-[35%] shape-seed'
            : 'left-[1%] top-[15%] h-[36%] w-[36%] shape-orbit'
        }`}
      >
        <img
          src={isStory ? FEDEM_IMAGES.group : FEDEM_IMAGES.agro}
          alt={isStory ? 'Membres de la FEDEM' : 'Projet agrobusiness de la FEDEM'}
          className="h-full w-full object-cover"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className={`absolute overflow-hidden ring-4 ${frame} shadow-xl ${
          isStory
            ? 'bottom-[1%] right-[18%] h-[39%] w-[39%] shape-petal'
            : 'bottom-[2%] left-[13%] h-[38%] w-[38%] shape-petal'
        }`}
      >
        <img
          src={isStory ? FEDEM_IMAGES.agro : FEDEM_IMAGES.field}
          alt="Agriculture et entrepreneuriat rural à Madagascar"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 7, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute bg-gradient-to-br from-fedem-400 to-fedem-700 shadow-xl shadow-fedem-600/20 ${
          isStory
            ? 'bottom-[10%] left-[1%] h-[22%] w-[22%] shape-leaf'
            : 'bottom-[8%] right-[5%] h-[24%] w-[24%] shape-leaf'
        }`}
        aria-hidden="true"
      />

      <div
        className={`absolute border border-fedem-400/40 ${
          isStory
            ? 'bottom-[2%] right-[2%] h-[18%] w-[18%] shape-orbit'
            : 'right-[25%] top-0 h-[15%] w-[15%] shape-orbit'
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute h-3 w-3 rounded-full bg-fedem-300 ${
          isStory ? 'left-[3%] top-[39%]' : 'bottom-[18%] left-[2%]'
        }`}
        aria-hidden="true"
      />
    </figure>
  );
}