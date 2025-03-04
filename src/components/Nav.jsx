import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NavOverlay = ({ isOpen, setIsOpen }) => {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const navItemsRef = useRef(null);
    const navigate = useNavigate();
    const progress = useSelector((state) => state.progress);

    useEffect(() => {
        gsap.set(leftRef.current, { x: "-100%" });
        gsap.set(rightRef.current, { x: "100%" });
    }, []);

    useEffect(() => {
        if (isOpen) {
            openNavAnimation();
        } else {
            closeNavAnimation();
        }
    }, [isOpen]);

    const openNavAnimation = () => {
        gsap.to(leftRef.current, {
            x: "0%",
            duration: 0.8,
            ease: "power2.out",
        });
        gsap.to(rightRef.current, {
            x: "0%",
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                gsap.fromTo(
                    navItemsRef.current.children,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.1,
                        duration: 0.6,
                        ease: "power2.out",
                    }
                );
            },
        });
    };

    const closeNavAnimation = () => {
        gsap.to(navItemsRef.current.children, {
            y: 30,
            opacity: 0,
            stagger: 0.05,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                gsap.to(leftRef.current, {
                    x: "-100%",
                    duration: 0.6,
                    ease: "power2.in",
                });
                gsap.to(rightRef.current, {
                    x: "100%",
                    duration: 0.6,
                    ease: "power2.in",
                    onComplete: () => {
                        // Update state after animations complete
                        setIsOpen(false);
                    },
                });
            },
        });
    };

    useEffect(() => {
        if (navItemsRef.current) {
            gsap.set(navItemsRef.current.children, { clearProps: "all" });
        }
    }, [progress]);

    const items = [
        { level: "story", url: "/story" },
        { level: "level1", url: "/level1" },
        { level: "level2", url: "/level2" },
        { level: "level3", url: "/level3" },
    ];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
        >
            <div
                ref={leftRef}
                className="absolute top-0 left-0 w-1/2 h-full bg-black z-0"
                style={{
                    backgroundImage: 'url("/images/Nav_Background.jpg")',
                    backgroundSize: "200%",
                    backgroundPosition: "left center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <div
                ref={rightRef}
                className="absolute top-0 right-0 w-1/2 h-full bg-black z-0"
                style={{
                    backgroundImage: 'url("/images/Nav_Background.jpg")',
                    backgroundSize: "200%",
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <nav className="relative z-10">
                <ul ref={navItemsRef} className="space-y-4 text-center flex flex-col">
                    {items.map((item, index) => {
                        const isUnlocked =
                            item.level === "story" ||
                            item.level === "level1" ||
                            progress[item.level];

                        return (
                            <li
                                key={index}
                                className={`text-2xl uppercase tracking-widest transition-colors cursor-pointer relative inline-block px-8 py-4 ${isUnlocked
                                    ? "text-[#00FFFF] hover:text-[#f1efef]"  // Cyan to Magenta on hover
                                    : "text-gray-500 cursor-not-allowed opacity-50"
                                    }`}
                                onClick={() => {
                                    if (isUnlocked) {
                                        navigate(item.url, { replace: true });
                                        closeNavAnimation();
                                    }
                                }}
                            >
                                {/* Hexagonal Shape */}
                                <div
                                    className={`relative inline-block px-10 py-5 border-2 ${isUnlocked ? "border-teal-400 hover:border-white" : "border-gray-500"
                                        }`}
                                    style={{
                                        clipPath:
                                            "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                                        background: isUnlocked ? "rgba(0, 255, 255, 0.1)" : "rgba(100, 100, 100, 0.1)",
                                        transition: "all 0.3s ease-in-out",
                                    }}
                                >
                                    {item.level}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default NavOverlay;
