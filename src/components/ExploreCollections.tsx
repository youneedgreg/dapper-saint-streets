import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

const collections = [
    {
        name: "THE PRELUDE",
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&auto=format&fit=crop',
        link: '/shop?collection=fw25'
    },
    {
        name: '247',
        image: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=1920&auto=format&fit=crop',
        link: '/shop?collection=247'
    },
    {
        name: 'Initial',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8cdb?w=1920&auto=format&fit=crop',
        link: '/shop?collection=initial'
    },
    {
        name: 'Owners Club',
        image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1920&auto=format&fit=crop',
        link: '/shop?collection=owners-club'
    },
    {
        name: 'Woman',
        image: 'https://images.unsplash.com/photo-1503342217505-b0815a002627?w=1920&auto=format&fit=crop',
        link: '/shop?collection=woman'
    },
];

const ExploreCollections = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const index = Math.min(
            Math.floor(latest * collections.length),
            collections.length - 1
        );
        setActiveIndex(index);
    });

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Background Images */}
                {collections.map((collection, index) => (
                    <motion.div
                        key={`bg-${collection.name}`}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeIndex === index ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </motion.div>
                ))}

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center">
                    <p className="text-white/80 text-xs md:text-sm tracking-[0.2em] uppercase mb-8 font-bold">
                        Explore Collections
                    </p>

                    <div className="space-y-2 md:space-y-4 relative">
                        {collections.map((collection, index) => (
                            <motion.div
                                key={`text-${collection.name}`}
                                animate={{
                                    scale: activeIndex === index ? 1 : 0.9,
                                    opacity: activeIndex === index ? 1 : 0.3,
                                    y: 0
                                }}
                                transition={{ duration: 0.3 }}
                                className="cursor-pointer"
                                onClick={() => {
                                    // Optional: Smooth scroll to section if clicked
                                }}
                            >
                                <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase transition-colors duration-300 ${activeIndex === index ? 'text-white' : 'text-white/50'
                                    }`}>
                                    {collection.name}
                                </h2>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            to={collections[activeIndex].link}
                            className="inline-flex items-center text-white text-sm tracking-[0.2em] uppercase border-b border-white hover:opacity-80 transition-opacity pb-1"
                        >
                            <span className="mr-2">→</span>
                            Discover
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ExploreCollections;
