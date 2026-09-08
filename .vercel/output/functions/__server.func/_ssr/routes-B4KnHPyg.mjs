import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { a as ShoppingBag, c as Mail, d as Instagram, f as Flame, g as ArrowUpRight, h as ChevronLeft, i as SquarePlay, l as LockKeyhole, m as ChevronRight, n as UserRound, o as Search, p as Clock3, r as TrendingUp, s as MapPin, t as X, u as Layers } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B4KnHPyg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex shrink-0 items-center justify-center gap-2 rounded-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			fire: "bg-primary text-primary-foreground shadow-fire hover:-translate-y-0.5 hover:bg-primary/90",
			outline: "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
			ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
		},
		size: {
			default: "h-11 px-5 text-sm",
			sm: "h-9 px-4 text-xs",
			lg: "h-13 px-7 text-sm uppercase tracking-[0.12em]",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "fire",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
var appetizers = [
	{
		id: 1,
		title1: "BATATA",
		title2: "FRITA",
		name: "Batatas Fritas",
		image: "/fries_appetizer.jpg",
		bgColor: "#ECA02A",
		textColor: "#ffffff"
	},
	{
		id: 2,
		title1: "ASINHA",
		title2: "DE FRANGO",
		name: "Coxas de Frango",
		image: "/chicken_wings_appetizer.jpg",
		bgColor: "#C6311E",
		textColor: "#ffffff"
	},
	{
		id: 3,
		title1: "ANÉIS",
		title2: "DE CEBOLA",
		name: "Onion Rings",
		image: "/onion_rings_appetizer.jpg",
		bgColor: "#C86218",
		textColor: "#ffffff"
	},
	{
		id: 4,
		title1: "PALITOS",
		title2: "DE QUEIJO",
		name: "Queijo Crocante",
		image: "/cheese_sticks_appetizer.jpg",
		bgColor: "#D75B29",
		textColor: "#ffffff"
	}
];
function AppetizerSlider() {
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	const isMobile = useIsMobile();
	const slideLeft = () => {
		setCurrentIndex((prev) => prev === appetizers.length - 1 ? 0 : prev + 1);
	};
	const slideRight = () => {
		setCurrentIndex((prev) => prev === 0 ? appetizers.length - 1 : prev - 1);
	};
	const currentApp = appetizers[currentIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative w-full h-[700px] sm:h-[850px] overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute inset-0 z-0",
				animate: { backgroundColor: currentApp.bgColor },
				transition: {
					duration: .8,
					ease: "easeInOut"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-8 w-full px-8 sm:px-16 flex justify-between items-center z-50 max-w-[1400px] left-1/2 -translate-x-1/2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display font-black text-4xl sm:text-5xl tracking-tighter text-white drop-shadow-md",
						children: "Entradas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "text-white size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "text-white size-4" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-20 w-full max-w-[1400px] mx-auto h-full flex flex-col md:flex-row items-center pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full md:w-5/12 px-8 sm:px-16 flex flex-col justify-center h-full z-30 mt-10 md:mt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							x: -30
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: {
							duration: .6,
							ease: "easeOut"
						},
						className: "flex flex-col mb-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-7xl sm:text-[110px] leading-[0.85] font-black tracking-tighter text-transparent",
							style: { WebkitTextStroke: "3px white" },
							children: currentApp.title1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-7xl sm:text-[110px] leading-[0.85] font-black tracking-tighter text-white drop-shadow-xl mt-2",
							children: currentApp.title2
						})]
					}, currentApp.title1), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "bg-[#2B1B15] text-white px-8 py-4 rounded-full font-bold text-sm w-fit hover:bg-black transition-colors shadow-xl",
							children: "PEDIR AGORA"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full md:w-7/12 relative h-[400px] sm:h-[600px] flex items-center justify-center perspective-[1200px]",
					children: appetizers.map((app, index) => {
						let offset = index - currentIndex;
						if (offset < -2) offset += appetizers.length;
						if (offset > 2) offset -= appetizers.length;
						if (!(offset >= -1 && offset <= 2)) return null;
						let x = 0;
						let y = 0;
						let scale = 1;
						let zIndex = 20;
						let rotate = 0;
						if (offset === 0) {
							x = 0;
							y = 0;
							scale = 1.35;
							zIndex = 30;
							rotate = 0;
						} else if (offset === 1) {
							x = 240;
							y = -110;
							scale = .75;
							zIndex = 20;
							rotate = 15;
						} else if (offset === 2) {
							x = 420;
							y = -190;
							scale = .5;
							zIndex = 10;
							rotate = 35;
						} else if (offset === -1) {
							x = -240;
							y = 130;
							scale = .75;
							zIndex = 15;
							rotate = -25;
						}
						if (isMobile) {
							x = x * .5;
							y = y * .5;
						}
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							className: "absolute top-1/2 left-1/2 cursor-pointer",
							initial: false,
							animate: {
								x: `calc(-50% + ${x}px)`,
								y: `calc(-55% + ${y}px)`,
								scale,
								rotate,
								zIndex,
								opacity: offset === 2 ? .2 : offset === -1 ? 0 : 1
							},
							transition: {
								type: "spring",
								stiffness: 70,
								damping: 10,
								mass: .9,
								velocity: 2
							},
							onClick: () => {
								if (offset === 1) slideLeft();
								if (offset === -1) slideRight();
							},
							style: { width: "360px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								className: "w-full h-full",
								animate: offset === 0 ? { y: [
									0,
									-15,
									0
								] } : { y: 0 },
								transition: { y: {
									duration: 4,
									repeat: Infinity,
									ease: "easeInOut"
								} },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: app.image,
									alt: app.name,
									className: "w-full object-contain drop-shadow-2xl mix-blend-multiply"
								})
							})
						}, app.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-0 left-0 w-full z-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 1440 320",
					preserveAspectRatio: "none",
					className: "w-full h-[100px] sm:h-[150px] text-[#FDF8F2] block mb-[-2px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "currentColor",
						fillOpacity: "1",
						d: "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full bg-[#FDF8F2] h-[100px] flex items-center justify-between px-8 sm:px-16 pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center gap-4 w-48" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: slideLeft,
								className: "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform text-[#2B1B15] border border-gray-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
									className: "size-5",
									strokeWidth: 3
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: slideRight,
								className: "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:scale-110 transition-transform text-[#2B1B15] border border-gray-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
									className: "size-5",
									strokeWidth: 3
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex gap-2 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-[#2B1B15]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-[#2B1B15]/30" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-[#2B1B15]/30" })
							]
						})
					]
				})]
			})
		]
	});
}
var hero_burger_default = "/assets/hero-burger-BiHNiNWL.png";
var burger_classico_default = "/assets/burger-classico-C3ZvqLk4.jpg";
var burger_brasa_default = "/assets/burger-brasa-DI7osFgN.jpg";
var burger_inferno_default = "/assets/burger-inferno-BHtVSU7b.jpg";
var bebida_cola_default = "/assets/bebida-cola-DI4pMqNT.jpg";
var bebida_limonada_default = "/assets/bebida-limonada-BIddq2R1.jpg";
var bebida_cerveja_default = "/assets/bebida-cerveja-CJ7_KqNA.jpg";
var soda_splash_default = "/assets/soda-splash-Cw0vypp1.jpg";
var coca_cola_default = "/assets/coca-cola-DwJ9H8xv.jpg";
var orange_juice_default = "/assets/orange-juice-CfvnbU21.jpg";
var lemonade_default = "/assets/lemonade-DZXyxUGr.jpg";
var beer_default = "/assets/beer-BmBFXmoO.jpg";
var iced_tea_default = "/assets/iced-tea-DUpIFCr4.jpg";
var guarana_default = "/assets/guarana-BJrheBPX.jpg";
var products = [
	{
		id: 1,
		name: "Chapa Clássico",
		description: "Blend 160g, cheddar inglês, picles agridoce e molho da casa no brioche tostado.",
		price: 34.9,
		image: burger_classico_default,
		badge: "Mais pedido",
		category: "burger"
	},
	{
		id: 2,
		name: "Brasa Bacon",
		description: "Blend 180g, queijo meia cura, bacon crocante, cebola caramelizada e barbecue de rapadura.",
		price: 42.9,
		image: burger_brasa_default,
		badge: "Assinatura",
		category: "burger"
	},
	{
		id: 3,
		name: "Inferno",
		description: "Blend 180g, cheddar, jalapeño, cebola crispy e molho vermelho picante da casa.",
		price: 39.9,
		image: burger_inferno_default,
		badge: "Picante",
		category: "burger"
	},
	{
		id: 4,
		name: "Cola Artesanal",
		description: "Cola de especiarias, gelada e servida com gelo cristalino.",
		price: 12.9,
		image: bebida_cola_default,
		category: "drink"
	},
	{
		id: 5,
		name: "Limonada Rubi",
		description: "Frutas vermelhas, limão, hortelã e um toque de laranja.",
		price: 15.9,
		image: bebida_limonada_default,
		badge: "Da casa",
		category: "drink"
	},
	{
		id: 6,
		name: "IPA da Chapa",
		description: "Cerveja artesanal âmbar, aromática e equilibrada. 473 ml.",
		price: 18.9,
		image: bebida_cerveja_default,
		category: "drink"
	}
];
Array.from({ length: 18 }, (_, index) => ({
	left: `${8 + index * 47 % 86}%`,
	delay: `${index % 7 * .42}s`,
	duration: `${3.4 + index % 5 * .48}s`
}));
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: "#inicio",
		className: "group flex items-center gap-3",
		"aria-label": "Fogo e Chapa — início",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-transform group-hover:rotate-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5 fill-current" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-display text-xl font-black uppercase leading-none text-foreground",
			children: [
				"Fogo ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: "&"
				}),
				" Chapa"
			]
		})]
	});
}
function Index() {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [authOpen, setAuthOpen] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("login");
	const [tab, setTab] = (0, import_react.useState)("burger");
	const [cart, setCart] = (0, import_react.useState)({});
	const [addedId, setAddedId] = (0, import_react.useState)(null);
	const [hoveredNav, setHoveredNav] = (0, import_react.useState)(null);
	const [isNavOpen, setIsNavOpen] = (0, import_react.useState)(false);
	const carouselSlides = [
		{
			id: "classico",
			titleLine1: "CHAPA",
			titleLine2: "CLÁSSICO",
			image: hero_burger_default,
			bgClass: "bg-[#00A144]",
			titleColor: "text-[#006B2D]",
			buttonBg: "bg-[#006B2D]",
			buttonText: "text-[#006B2D]",
			badges: [
				{
					text: "Juicy",
					style: "top-[25%] left-[25%] -rotate-12"
				},
				{
					text: "Smash",
					style: "top-[35%] left-[20%] -rotate-6"
				},
				{
					text: "160g",
					style: "top-[50%] left-[23%] rotate-6"
				}
			]
		},
		{
			id: "brasa",
			titleLine1: "BRASA",
			titleLine2: "BACON",
			image: hero_burger_default,
			bgClass: "bg-[#4B168C]",
			titleColor: "text-[#2B005F]",
			buttonBg: "bg-[#2B005F]",
			buttonText: "text-[#2B005F]",
			badges: [
				{
					text: "Bacon",
					style: "top-[25%] left-[25%] -rotate-12"
				},
				{
					text: "Cheddar",
					style: "top-[35%] left-[20%] -rotate-6"
				},
				{
					text: "180g",
					style: "top-[50%] left-[23%] rotate-6"
				}
			]
		},
		{
			id: "inferno",
			titleLine1: "INFERNO",
			titleLine2: "PICANTE",
			image: hero_burger_default,
			bgClass: "bg-[#C41E00]",
			titleColor: "text-[#7A1200]",
			buttonBg: "bg-[#7A1200]",
			buttonText: "text-[#7A1200]",
			badges: [
				{
					text: "Picante",
					style: "top-[25%] left-[25%] -rotate-12"
				},
				{
					text: "Jalapeño",
					style: "top-[35%] left-[20%] -rotate-6"
				},
				{
					text: "180g",
					style: "top-[50%] left-[23%] rotate-6"
				}
			]
		}
	];
	const [heroIndex, setHeroIndex] = (0, import_react.useState)(0);
	const [slideDirection, setSlideDirection] = (0, import_react.useState)(1);
	const nextHero = () => {
		setSlideDirection(1);
		setHeroIndex((prev) => (prev + 1) % carouselSlides.length);
	};
	const prevHero = () => {
		setSlideDirection(-1);
		setHeroIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
	};
	const currentSlide = carouselSlides[heroIndex];
	const currentTheme = (0, import_react.useMemo)(() => {
		switch (heroIndex) {
			case 0: return {
				bgLight: "#F0FAF4",
				bgDark: "#0B1F13",
				bgVeryDark: "#040B07",
				primary: "#006B2D",
				secondary: "#00A144",
				secondaryAlpha: "rgba(0, 161, 68, 0.15)",
				textDark: "#05140B"
			};
			case 1: return {
				bgLight: "#F5F0FA",
				bgDark: "#150824",
				bgVeryDark: "#0B0414",
				primary: "#2B005F",
				secondary: "#4B168C",
				secondaryAlpha: "rgba(75, 22, 140, 0.15)",
				textDark: "#10031F"
			};
			case 2: return {
				bgLight: "#FAF0F0",
				bgDark: "#260602",
				bgVeryDark: "#120301",
				primary: "#7A1200",
				secondary: "#C41E00",
				secondaryAlpha: "rgba(196, 30, 0, 0.15)",
				textDark: "#1F0400"
			};
			default: return {
				bgLight: "#F0FAF4",
				bgDark: "#0B1F13",
				bgVeryDark: "#040B07",
				primary: "#006B2D",
				secondary: "#00A144",
				secondaryAlpha: "rgba(0, 161, 68, 0.15)",
				textDark: "#05140B"
			};
		}
	}, [heroIndex]);
	Object.values(cart).reduce((sum, count) => sum + count, 0);
	(0, import_react.useMemo)(() => products.filter((product) => product.category === tab), [tab]);
	(0, import_react.useEffect)(() => {
		if (!authOpen) return;
		const close = (event) => event.key === "Escape" && setAuthOpen(false);
		document.addEventListener("keydown", close);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", close);
			document.body.style.overflow = "";
		};
	}, [authOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `min-h-screen overflow-x-hidden transition-colors duration-700 ease-in-out ${currentSlide.bgClass} text-foreground`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "absolute inset-x-0 top-0 z-40 bg-transparent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							className: "flex items-center gap-2",
							initial: {
								opacity: 0,
								x: -20
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: {
								duration: .6,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl sm:text-3xl",
								children: "🔥"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl sm:text-2xl font-black tracking-tighter text-white",
								children: "HOTBITE"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.nav, {
							className: "hidden md:flex items-center gap-1 text-sm font-bold text-white bg-white/10 backdrop-blur-sm rounded-full px-2 py-2",
							initial: "hidden",
							animate: "visible",
							variants: {
								hidden: {},
								visible: { transition: {
									staggerChildren: .1,
									delayChildren: .2
								} }
							},
							onMouseLeave: () => setHoveredNav(null),
							children: [
								{
									href: "#about",
									label: "About"
								},
								{
									href: "#menu",
									label: "Menu"
								},
								{
									href: "#gallery",
									label: "Gallery"
								},
								{
									href: "#delivery",
									label: "Delivery"
								},
								{
									href: "#drinks",
									label: "Drinks"
								}
							].map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.a, {
								href: link.href,
								className: "relative px-5 py-2 rounded-full z-10",
								variants: {
									hidden: {
										opacity: 0,
										y: -20,
										filter: "blur(6px)"
									},
									visible: {
										opacity: 1,
										y: 0,
										filter: "blur(0px)",
										transition: {
											duration: .6,
											ease: [
												.16,
												1,
												.3,
												1
											]
										}
									}
								},
								whileTap: { scale: .95 },
								onMouseEnter: () => setHoveredNav(link.href),
								children: [hoveredNav === link.href && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: "navPill",
									className: "absolute inset-0 bg-white/20 rounded-full",
									transition: {
										type: "spring",
										stiffness: 400,
										damping: 30
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative z-10",
									children: link.label
								})]
							}, link.href))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								x: 20
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: {
								duration: .6,
								delay: .5,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold px-6 transition-colors",
								children: "Contact Us"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "inicio",
					className: "relative flex min-h-screen items-center justify-center overflow-hidden pt-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 text-center w-full flex flex-col items-center justify-center h-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative mt-12 sm:mt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
									mode: "wait",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: "hidden",
										animate: "visible",
										exit: "exit",
										variants: {
											hidden: {},
											visible: { transition: { staggerChildren: .12 } },
											exit: { transition: {
												staggerChildren: .06,
												staggerDirection: -1
											} }
										},
										children: [currentSlide.titleLine1, currentSlide.titleLine2].map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
												className: `font-display text-[20vw] sm:text-[18vw] leading-[0.85] font-black uppercase tracking-tighter ${currentSlide.titleColor}`,
												variants: {
													hidden: {
														y: "100%",
														opacity: 0,
														skewY: slideDirection * 6
													},
													visible: {
														y: "0%",
														opacity: 1,
														skewY: 0,
														transition: {
															duration: .7,
															ease: [
																.16,
																1,
																.3,
																1
															]
														}
													},
													exit: {
														y: "-100%",
														opacity: 0,
														skewY: slideDirection * -4,
														transition: {
															duration: .4,
															ease: [
																.55,
																0,
																1,
																.45
															]
														}
													}
												},
												children: line
											})
										}, i))
									}, currentSlide.id + "-title")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] sm:w-[42vw] max-w-[520px] pointer-events-none z-20",
								style: { perspective: "1200px" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
									mode: "popLayout",
									initial: false,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
										src: currentSlide.image,
										alt: currentSlide.titleLine1 + " " + currentSlide.titleLine2,
										initial: {
											x: slideDirection * 600,
											opacity: 0,
											rotateY: slideDirection * 40,
											rotateZ: slideDirection * 10,
											scale: .4,
											filter: "blur(12px)"
										},
										animate: {
											x: 0,
											opacity: 1,
											rotateY: 0,
											rotateZ: 0,
											scale: 1,
											filter: "blur(0px)",
											y: [
												0,
												-8,
												0
											]
										},
										exit: {
											x: slideDirection * -600,
											opacity: 0,
											rotateY: slideDirection * -40,
											rotateZ: slideDirection * -10,
											scale: .4,
											filter: "blur(12px)"
										},
										transition: {
											type: "spring",
											stiffness: 70,
											damping: 12,
											mass: .5,
											filter: { duration: .25 },
											y: {
												duration: 3,
												repeat: Infinity,
												repeatType: "reverse",
												ease: "easeInOut",
												delay: .8
											}
										},
										className: `w-full h-auto object-contain drop-shadow-2xl ${heroIndex === 1 ? "scale-x-[-1]" : ""} ${heroIndex === 2 ? "hue-rotate-15 saturate-150" : ""}`
									}, currentSlide.id)
								})
							}),
							currentSlide.badges.map((badge, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									scale: 0,
									opacity: 0
								},
								animate: {
									scale: 1,
									opacity: 1
								},
								transition: {
									delay: .3 + idx * .1,
									type: "spring"
								},
								className: `hidden sm:block absolute ${badge.style} bg-white border-2 px-4 py-1.5 rounded-full font-bold text-sm z-30 shadow-lg transition-colors duration-700 border-current ${currentSlide.buttonText}`,
								children: badge.text
							}, currentSlide.id + idx)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:block absolute top-[60%] right-[32%] text-4xl z-30 drop-shadow-lg",
								children: "😋"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:block absolute top-1/2 left-8 -translate-y-1/2 z-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: prevHero,
									size: "icon",
									variant: "outline",
									className: "bg-white text-black hover:bg-gray-100 rounded-full size-14 shadow-xl border-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-8" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:block absolute top-1/2 right-8 -translate-y-1/2 z-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: nextHero,
									size: "icon",
									variant: "outline",
									className: "bg-white text-black hover:bg-gray-100 rounded-full size-14 shadow-xl border-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-8" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-30 mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: `rounded-full text-white font-bold px-8 py-6 text-lg transition-colors duration-700 ease-in-out hover:opacity-90 ${currentSlide.buttonBg}`,
									children: "View Menu"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: `rounded-full bg-white font-bold px-8 py-6 text-lg border-0 transition-colors duration-700 ease-in-out hover:bg-gray-100 ${currentSlide.buttonText}`,
									children: "Find Us"
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative -mt-1 z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 1440 120",
						preserveAspectRatio: "none",
						className: "block w-full h-[60px] sm:h-[90px] md:h-[120px] transition-colors duration-700",
						style: { fill: currentTheme.bgDark },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0,0 C20,15 40,8 60,20 C80,32 95,10 120,25 C145,40 155,18 180,30 C205,42 220,15 240,28 C260,41 280,12 300,22 C320,32 340,8 360,18 C380,28 400,5 420,15 C440,25 460,10 480,20 C500,30 520,8 540,22 C560,36 575,12 600,25 C625,38 640,10 660,20 C680,30 700,8 720,18 C740,28 760,5 780,15 C800,25 820,10 840,22 C860,34 880,8 900,20 C920,32 940,12 960,25 C980,38 1000,10 1020,22 C1040,34 1060,8 1080,18 C1100,28 1120,5 1140,15 C1160,25 1180,10 1200,22 C1220,34 1240,8 1260,20 C1280,32 1300,12 1320,25 C1340,38 1360,15 1380,22 C1400,29 1420,10 1440,18 L1440,120 L0,120 Z" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "menu",
					className: "relative border-border py-20 sm:py-28 overflow-hidden transition-colors duration-700",
					style: { backgroundColor: currentTheme.bgDark },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mx-auto max-w-7xl px-5 lg:px-8 text-center mb-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase mb-4 transition-colors duration-700",
							style: { color: currentTheme.bgLight },
							children: ["Sabor que fala alto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block align-middle text-4xl sm:text-5xl md:text-6xl -mt-2",
								children: "🔥"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg sm:text-xl font-medium tracking-wide opacity-80 transition-colors duration-700",
							style: { color: currentTheme.bgLight },
							children: "Sabores autênticos servidos frescos todos os dias."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 100,
								scale: .97
							},
							whileInView: {
								opacity: 1,
								y: 0,
								scale: 1
							},
							viewport: {
								once: true,
								amount: .05
							},
							transition: {
								duration: .9,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							className: "rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 shadow-2xl origin-bottom transition-colors duration-700",
							style: { backgroundColor: currentTheme.bgLight },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-6 border-b-2 border-black/10 pb-6 transition-colors duration-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-5xl sm:text-6xl font-black tracking-tighter transition-colors duration-700",
									style: { color: currentTheme.textDark },
									children: "CARDÁPIO"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-4 py-2 bg-white rounded-full text-xs font-bold text-[#2D150D] border border-[#2D150D]/10 shadow-sm flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-500 text-sm",
											children: "★"
										}), " Avaliação 4.9"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-4 py-2 bg-white rounded-full text-xs font-bold text-[#2D150D] border border-[#2D150D]/10 shadow-sm flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-500 text-sm",
											children: "♥"
										}), " Favorito Local"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-12",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: "hidden",
											whileInView: "visible",
											viewport: {
												once: true,
												margin: "-50px"
											},
											variants: {
												hidden: {
													opacity: 0,
													y: 40
												},
												visible: {
													opacity: 1,
													y: 0,
													transition: {
														duration: .6,
														ease: "easeOut",
														staggerChildren: .12,
														delayChildren: .1
													}
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700",
												style: { color: currentTheme.textDark },
												children: "PIZZAS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-col gap-5",
												children: [
													{
														name: "PEPPERONI",
														price: "12,00",
														spicy: true
													},
													{
														name: "MARGHERITA",
														price: "11,75"
													},
													{
														name: "FRANGO BBQ",
														price: "14,25"
													},
													{
														name: "QUATRO QUEIJOS",
														price: "13,00"
													},
													{
														name: "SALAME PICANTE",
														price: "15,50",
														spicy: true
													},
													{
														name: "COGUMELO TRUFADO",
														price: "16,00"
													},
													{
														name: "VEGETARIANA",
														price: "13,00"
													}
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													variants: {
														hidden: {
															opacity: 0,
															x: -30
														},
														visible: {
															opacity: 1,
															x: 0,
															transition: {
																type: "spring",
																damping: 22,
																stiffness: 120
															}
														}
													},
													className: "flex items-center w-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors",
															children: item.name
														}),
														item.spicy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-2 text-sm",
															title: "Apimentado",
															children: "🌶️"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right",
															children: ["R$ ", item.price]
														})
													]
												}, item.name))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: "hidden",
											whileInView: "visible",
											viewport: {
												once: true,
												margin: "-50px"
											},
											variants: {
												hidden: {
													opacity: 0,
													y: 40
												},
												visible: {
													opacity: 1,
													y: 0,
													transition: {
														duration: .6,
														ease: "easeOut",
														staggerChildren: .12,
														delayChildren: .1
													}
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700",
												style: { color: currentTheme.textDark },
												children: "HAMBÚRGUERES"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-col gap-5",
												children: [
													{
														name: "CLÁSSICO",
														price: "10,50"
													},
													{
														name: "DUPLO QUEIJO",
														price: "13,00"
													},
													{
														name: "SMASH",
														price: "13,75"
													},
													{
														name: "BACON BBQ",
														price: "14,00"
													},
													{
														name: "FRANGO CROCANTE",
														price: "12,00",
														spicy: true
													}
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													variants: {
														hidden: {
															opacity: 0,
															x: -30
														},
														visible: {
															opacity: 1,
															x: 0,
															transition: {
																type: "spring",
																damping: 22,
																stiffness: 120
															}
														}
													},
													className: "flex items-center w-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors",
															children: item.name
														}),
														item.spicy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-2 text-sm",
															title: "Apimentado",
															children: "🌶️"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right",
															children: ["R$ ", item.price]
														})
													]
												}, item.name))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: "hidden",
											whileInView: "visible",
											viewport: {
												once: true,
												margin: "-50px"
											},
											variants: {
												hidden: {
													opacity: 0,
													y: 40
												},
												visible: {
													opacity: 1,
													y: 0,
													transition: {
														duration: .6,
														ease: "easeOut",
														staggerChildren: .12,
														delayChildren: .1
													}
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700",
												style: { color: currentTheme.textDark },
												children: "CACHORRO-QUENTE"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-col gap-5",
												children: [
													{
														name: "CLÁSSICO",
														price: "7,25"
													},
													{
														name: "CHILI COM QUEIJO",
														price: "8,25"
													},
													{
														name: "BACON E QUEIJO",
														price: "11,00"
													}
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													variants: {
														hidden: {
															opacity: 0,
															x: -30
														},
														visible: {
															opacity: 1,
															x: 0,
															transition: {
																type: "spring",
																damping: 22,
																stiffness: 120
															}
														}
													},
													className: "flex items-center w-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors",
															children: item.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right",
															children: ["R$ ", item.price]
														})
													]
												}, item.name))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: "hidden",
											whileInView: "visible",
											viewport: {
												once: true,
												margin: "-50px"
											},
											variants: {
												hidden: {
													opacity: 0,
													y: 40
												},
												visible: {
													opacity: 1,
													y: 0,
													transition: {
														duration: .6,
														ease: "easeOut",
														staggerChildren: .12,
														delayChildren: .1
													}
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700",
												style: { color: currentTheme.textDark },
												children: "WRAPS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-col gap-5",
												children: [
													{
														name: "FRANGO",
														price: "8,50"
													},
													{
														name: "CAESAR",
														price: "11,25"
													},
													{
														name: "CROCANTE APIMENTADO",
														price: "11,00",
														spicy: true
													},
													{
														name: "FRANGO COM ALHO",
														price: "12,50"
													}
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													variants: {
														hidden: {
															opacity: 0,
															x: -30
														},
														visible: {
															opacity: 1,
															x: 0,
															transition: {
																type: "spring",
																damping: 22,
																stiffness: 120
															}
														}
													},
													className: "flex items-center w-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors",
															children: item.name
														}),
														item.spicy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-2 text-sm",
															title: "Apimentado",
															children: "🌶️"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right",
															children: ["R$ ", item.price]
														})
													]
												}, item.name))
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-12",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: "hidden",
											whileInView: "visible",
											viewport: {
												once: true,
												margin: "-50px"
											},
											variants: {
												hidden: {
													opacity: 0,
													y: 40
												},
												visible: {
													opacity: 1,
													y: 0,
													transition: {
														duration: .6,
														ease: "easeOut",
														staggerChildren: .12,
														delayChildren: .1
													}
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700",
												style: { color: currentTheme.textDark },
												children: "ASINHAS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-col gap-5",
												children: [
													{
														name: "BUFFALO",
														price: "12,00",
														spicy: true
													},
													{
														name: "BBQ",
														price: "11,00"
													},
													{
														name: "MEL GLAÇADO",
														price: "14,50"
													},
													{
														name: "MEL APIMENTADO",
														price: "14,00",
														spicy: true
													},
													{
														name: "LEMON PEPPER",
														price: "13,00"
													}
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													variants: {
														hidden: {
															opacity: 0,
															x: -30
														},
														visible: {
															opacity: 1,
															x: 0,
															transition: {
																type: "spring",
																damping: 22,
																stiffness: 120
															}
														}
													},
													className: "flex items-center w-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors",
															children: item.name
														}),
														item.spicy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-2 text-sm",
															title: "Apimentado",
															children: "🌶️"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right",
															children: ["R$ ", item.price]
														})
													]
												}, item.name))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: "hidden",
											whileInView: "visible",
											viewport: {
												once: true,
												margin: "-50px"
											},
											variants: {
												hidden: {
													opacity: 0,
													y: 40
												},
												visible: {
													opacity: 1,
													y: 0,
													transition: {
														duration: .6,
														ease: "easeOut",
														staggerChildren: .12,
														delayChildren: .1
													}
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700",
												style: { color: currentTheme.textDark },
												children: "ANÉIS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-col gap-5",
												children: [
													{
														name: "CEBOLA",
														price: "4,25"
													},
													{
														name: "JALAPEÑO",
														price: "9,00",
														spicy: true
													},
													{
														name: "CROCANTE",
														price: "7,75"
													}
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													variants: {
														hidden: {
															opacity: 0,
															x: -30
														},
														visible: {
															opacity: 1,
															x: 0,
															transition: {
																type: "spring",
																damping: 22,
																stiffness: 120
															}
														}
													},
													className: "flex items-center w-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors",
															children: item.name
														}),
														item.spicy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-2 text-sm",
															title: "Apimentado",
															children: "🌶️"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right",
															children: ["R$ ", item.price]
														})
													]
												}, item.name))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: {
												opacity: 0,
												scale: .9,
												y: 40,
												rotate: -2
											},
											whileInView: {
												opacity: 1,
												scale: 1,
												y: 0,
												rotate: 0
											},
											viewport: {
												once: true,
												margin: "-50px"
											},
											transition: {
												type: "spring",
												damping: 20,
												stiffness: 90,
												delay: .3
											},
											className: "bg-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-colors" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-block px-3 py-1 bg-black/20 rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20 shadow-sm",
													children: "15 JUN – 18 JUN"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-display text-2xl sm:text-3xl font-black leading-tight mb-6 drop-shadow-md",
													children: "COMBO WRAP + BATATA POR APENAS R$ 35"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
													whileTap: { scale: .95 },
													whileHover: { y: -2 },
													className: "bg-[#2D150D] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-black transition-all w-full sm:w-auto shadow-lg hover:shadow-xl",
													children: "Onde Estamos"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: "hidden",
											whileInView: "visible",
											viewport: {
												once: true,
												margin: "-50px"
											},
											variants: {
												hidden: {
													opacity: 0,
													y: 40
												},
												visible: {
													opacity: 1,
													y: 0,
													transition: {
														duration: .6,
														ease: "easeOut",
														staggerChildren: .12,
														delayChildren: .1
													}
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-3xl font-black mb-6 tracking-tight transition-colors duration-700",
												style: { color: currentTheme.textDark },
												children: "BEBIDAS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-col gap-5",
												children: [
													{
														name: "COCA-COLA",
														price: "2,25"
													},
													{
														name: "LIMONADA",
														price: "3,00"
													},
													{
														name: "CHÁ GELADO",
														price: "3,75"
													},
													{
														name: "REFRIGERANTE DE LARANJA",
														price: "2,00"
													},
													{
														name: "MILKSHAKE",
														price: "5,50"
													},
													{
														name: "MOJITO",
														price: "4,00"
													},
													{
														name: "COLD BREW",
														price: "2,00"
													}
												].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
													variants: {
														hidden: {
															opacity: 0,
															x: -30
														},
														visible: {
															opacity: 1,
															x: 0,
															transition: {
																type: "spring",
																damping: 22,
																stiffness: 120
															}
														}
													},
													className: "flex items-center w-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight group-hover:text-amber-700 transition-colors",
															children: item.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-[3px] border-dotted border-[#2D150D]/20 flex-1 mx-4 opacity-50 relative top-1" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#2D150D] border-[1.5px] border-amber-900/30 rounded-full px-3 py-1 text-sm bg-white shadow-sm group-hover:scale-105 transition-transform origin-right",
															children: ["R$ ", item.price]
														})
													]
												}, item.name))
											})]
										})
									]
								})]
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppetizerSlider, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative overflow-hidden border-y border-border py-24 flex flex-col items-center transition-colors duration-700",
					style: { backgroundColor: currentTheme.bgVeryDark },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-60 pointer-events-none transition-colors duration-700",
							style: { backgroundImage: `radial-gradient(ellipse at center, ${currentTheme.secondaryAlpha} 0%, transparent 100%)` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 w-full mb-8 flex justify-center text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center max-w-3xl px-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl sm:text-3xl font-medium mb-6 opacity-70 transition-colors duration-700",
									style: { color: currentTheme.bgLight },
									children: "Criado para atrair, despertar fome e surpreender seu paladar."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex items-center gap-2 text-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5",
										style: { backgroundColor: currentTheme.secondary },
										children: ["Fazer Pedido ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "flex items-center gap-2 border border-white/10 text-white px-7 py-3 rounded-full font-bold text-sm transition-all hover:bg-white/10",
										style: { backgroundColor: currentTheme.bgDark },
										children: "Ver Cardápio"
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
            @keyframes spinGallery {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(360deg); }
            }
            .animate-spin-gallery {
              animation: spinGallery 40s linear infinite;
            }
            .animate-spin-gallery:hover {
              animation-play-state: paused;
            }
          ` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 w-full flex justify-center items-center h-[350px] sm:h-[450px]",
							style: { perspective: "800px" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative w-full h-full flex justify-center items-center scale-[0.6] sm:scale-100 mt-10",
								style: { transformStyle: "preserve-3d" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute w-full h-full animate-spin-gallery cursor-grab active:cursor-grabbing",
									style: { transformStyle: "preserve-3d" },
									children: [
										{
											img: "/burger_one.jpg",
											alt: "Fogo e Chapa Burger 1"
										},
										{
											img: "/pizza_hero.jpg",
											alt: "Fogo e Chapa Pizza"
										},
										{
											img: "/hotdog.jpg",
											alt: "Fogo e Chapa Hot Dog"
										},
										{
											img: "/burger_three.jpg",
											alt: "Fogo e Chapa Burger 3"
										},
										{
											img: "/wrap.jpg",
											alt: "Fogo e Chapa Wrap"
										},
										{
											img: "/burger_two.jpg",
											alt: "Fogo e Chapa Burger 2"
										},
										{
											img: "/burger_one.jpg",
											alt: "Fogo e Chapa Burger 1"
										},
										{
											img: "/pizza_hero.jpg",
											alt: "Fogo e Chapa Pizza"
										},
										{
											img: "/hotdog.jpg",
											alt: "Fogo e Chapa Hot Dog"
										},
										{
											img: "/burger_three.jpg",
											alt: "Fogo e Chapa Burger 3"
										},
										{
											img: "/wrap.jpg",
											alt: "Fogo e Chapa Wrap"
										},
										{
											img: "/burger_two.jpg",
											alt: "Fogo e Chapa Burger 2"
										}
									].map((item, idx) => {
										const angle = idx * (360 / 12);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute left-1/2 top-1/2 w-[240px] h-[340px] sm:w-[280px] sm:h-[380px] -ml-[120px] sm:-ml-[140px] -mt-[170px] sm:-mt-[190px] rounded-[24px] overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:border-amber-500/30",
											style: {
												transform: `rotateY(${angle}deg) translateZ(-550px)`,
												backfaceVisibility: "hidden"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.img,
												alt: item.alt,
												className: "w-full h-full object-cover"
											})
										}, idx);
									})
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-16 px-6 sm:px-8 py-3.5 border border-[#D14F26]/30 bg-[#1A0A05]/80 backdrop-blur-md rounded-full shadow-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-[#FBF5E9]/90 text-xs sm:text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePlay, { className: "size-4 opacity-70" }), " Sabor Incomparável"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#D14F26] text-xs",
									children: "◆"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-[#FBF5E9]/90 text-xs sm:text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 opacity-70" }), " Ingredientes Frescos"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#D14F26] text-xs",
									children: "◆"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-[#FBF5E9]/90 text-xs sm:text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 opacity-70" }), " Fogo na Chapa"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "drinks",
					className: "relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden bg-white py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mx-auto max-w-7xl px-5 lg:px-12 flex flex-col md:flex-row items-center justify-center w-full h-full gap-8 md:gap-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full md:w-[50%] flex flex-col justify-center relative z-20 mt-10 md:mt-0 order-2 md:order-1 h-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full max-w-2xl pl-2 md:pl-8 pt-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										scale: .5,
										rotate: -20
									},
									whileInView: {
										opacity: 1,
										scale: 1,
										rotate: -12
									},
									viewport: { once: true },
									transition: {
										type: "spring",
										delay: .2
									},
									className: "absolute -top-4 left-4 md:-top-2 md:left-8 bg-white border-[3px] rounded-full px-3 py-1 md:px-4 md:py-2 shadow-[2px_3px_0px_rgba(0,0,0,0.2)] z-30 flex flex-col items-center transition-colors duration-700",
									style: { borderColor: currentTheme.primary },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display font-black text-[10px] md:text-sm leading-none tracking-tighter transition-colors duration-700",
										style: { color: currentTheme.primary },
										children: "BOM"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display font-black text-[10px] md:text-sm leading-none tracking-tighter transition-colors duration-700",
										style: { color: currentTheme.primary },
										children: "HUMOR"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 50
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: { once: true },
									transition: {
										duration: .8,
										ease: "easeOut"
									},
									className: "relative z-20 flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-[17vw] md:text-[10vw] leading-[0.85] font-black uppercase tracking-tighter ml-6 md:ml-12 transition-all duration-700",
										style: {
											color: currentTheme.secondary,
											textShadow: `6px 6px 0px ${currentTheme.secondaryAlpha}`
										},
										children: "NOSSOS"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-2 md:mt-4 w-fit",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 transform -skew-y-3 -rotate-2 scale-105 origin-left transition-colors duration-700",
											style: { backgroundColor: currentTheme.secondary }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "relative font-display text-[17vw] md:text-[10vw] leading-[0.85] font-black text-white uppercase tracking-tighter px-4 py-2 transform -skew-y-3 -rotate-2 transition-all duration-700",
											style: { WebkitTextStroke: `2px ${currentTheme.secondary}` },
											children: "DRINKS"
										})]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: { opacity: 0 },
								whileInView: { opacity: 1 },
								viewport: { once: true },
								transition: {
									delay: .4,
									duration: .8
								},
								className: "mt-14 md:mt-20 max-w-[320px] pl-6 md:pl-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display font-black text-xl mb-3 tracking-tighter uppercase transition-colors duration-700",
										style: { color: currentTheme.secondary },
										children: "NOSSA HISTÓRIA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-relaxed mb-8 font-medium transition-colors duration-700 opacity-80",
										style: { color: currentTheme.primary },
										children: "Refrigerantes gelados e bebidas feitas para refrescar o seu dia. Encontre a nossa hamburgueria e aproveite uma experiência de sabor na brasa."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "rounded-full text-white font-black uppercase px-6 py-6 text-sm transition-all duration-700 border-[3px] flex items-center gap-3 w-fit",
										style: {
											backgroundColor: currentTheme.secondary,
											borderColor: currentTheme.secondary
										},
										children: ["PEDIR AGORA ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
											className: "size-5 bg-white rounded-full p-0.5 transition-colors duration-700",
											style: { color: currentTheme.secondary }
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full md:w-[50%] relative min-h-[400px] md:min-h-[700px] flex justify-end items-center order-1 md:order-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									opacity: 0,
									x: 100
								},
								whileInView: {
									opacity: 1,
									x: 0
								},
								viewport: { once: true },
								transition: {
									type: "spring",
									stiffness: 40,
									damping: 15,
									duration: 1.2
								},
								className: "relative z-20 w-full max-w-[700px] md:max-w-[900px] lg:max-w-[1000px] flex justify-end md:-mr-12 lg:-mr-32 xl:-mr-48",
								style: { mixBlendMode: "multiply" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: soda_splash_default,
									alt: "Refrigerante Gelado",
									className: "w-full h-auto object-contain scale-110 md:scale-125 lg:scale-150 origin-right"
								})
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "w-full py-16 md:py-24 border-t transition-colors duration-700",
					style: {
						backgroundColor: currentTheme.bgLight,
						borderColor: currentTheme.secondaryAlpha
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-[1400px] px-5 lg:px-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 md:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h2, {
								initial: {
									opacity: 0,
									y: 20
								},
								whileInView: {
									opacity: 1,
									y: 0
								},
								viewport: { once: true },
								className: "font-display font-black text-5xl md:text-6xl lg:text-[5.5rem] leading-[0.85] uppercase tracking-tighter max-w-xl transition-colors duration-700",
								style: { color: currentTheme.secondary },
								children: [
									"DRINKS FOR",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"EVERYDAY"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									opacity: 0,
									x: 20
								},
								whileInView: {
									opacity: 1,
									x: 0
								},
								viewport: { once: true },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "rounded-full text-white font-black uppercase px-6 py-5 text-sm transition-all duration-700 border-[3px] flex items-center gap-3",
									style: {
										backgroundColor: currentTheme.secondary,
										borderColor: currentTheme.secondary
									},
									children: ["VIEW ALL MENU ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
										className: "size-5 bg-white rounded-full p-0.5 transition-colors duration-700",
										style: { color: currentTheme.secondary }
									})]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 30
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: { once: true },
									transition: { delay: .1 },
									className: "flex flex-col md:border-r pr-0 md:pr-8 lg:pr-12 pb-16 md:border-b transition-colors duration-700",
									style: { borderColor: currentTheme.secondaryAlpha },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between mb-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: [
												"COLA",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												"TRADICIONAL"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: "ORDER NOW +"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 flex items-center justify-center relative min-h-[300px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: coca_cola_default,
											alt: "Cola Tradicional",
											className: "w-full max-w-[280px] h-auto object-contain mix-blend-multiply",
											style: { filter: "contrast(1.15) brightness(1.08)" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 30
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: { once: true },
									transition: { delay: .2 },
									className: "flex flex-col md:border-r px-0 md:px-8 lg:px-12 mt-12 md:mt-0 pb-16 md:border-b transition-colors duration-700",
									style: { borderColor: currentTheme.secondaryAlpha },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between mb-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: [
												"SUCO DE",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												"LARANJA"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: "ORDER NOW +"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 flex items-center justify-center relative min-h-[300px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: orange_juice_default,
											alt: "Suco de Laranja",
											className: "w-full max-w-[280px] h-auto object-contain mix-blend-multiply",
											style: { filter: "contrast(1.15) brightness(1.08)" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 30
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: { once: true },
									transition: { delay: .3 },
									className: "flex flex-col pl-0 md:pl-8 lg:pl-12 mt-12 md:mt-0 pb-16 md:border-b transition-colors duration-700",
									style: { borderColor: currentTheme.secondaryAlpha },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between mb-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: [
												"LIMONADA",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												"SUÍÇA"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: "ORDER NOW +"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 flex items-center justify-center relative min-h-[300px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: lemonade_default,
											alt: "Limonada Suíça",
											className: "w-full max-w-[280px] h-auto object-contain mix-blend-multiply",
											style: { filter: "contrast(1.15) brightness(1.08)" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 30
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: { once: true },
									transition: { delay: .4 },
									className: "flex flex-col md:border-r pr-0 md:pr-8 lg:pr-12 pt-16 transition-colors duration-700",
									style: { borderColor: currentTheme.secondaryAlpha },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between mb-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: [
												"CHOPP",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												"GELADO"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: "ORDER NOW +"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 flex items-center justify-center relative min-h-[300px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: beer_default,
											alt: "Chopp Gelado",
											className: "w-full max-w-[280px] h-auto object-contain mix-blend-multiply",
											style: { filter: "contrast(1.15) brightness(1.08)" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 30
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: { once: true },
									transition: { delay: .5 },
									className: "flex flex-col md:border-r px-0 md:px-8 lg:px-12 pt-16 transition-colors duration-700",
									style: { borderColor: currentTheme.secondaryAlpha },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between mb-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: [
												"CHÁ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												"GELADO"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: "ORDER NOW +"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 flex items-center justify-center relative min-h-[300px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: iced_tea_default,
											alt: "Chá Gelado",
											className: "w-full max-w-[280px] h-auto object-contain mix-blend-multiply",
											style: { filter: "contrast(1.15) brightness(1.08)" }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 30
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: { once: true },
									transition: { delay: .6 },
									className: "flex flex-col pl-0 md:pl-8 lg:pl-12 pt-16 transition-colors duration-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between mb-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-black text-2xl lg:text-3xl leading-none uppercase transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: [
												"GUARANÁ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												"NATURAL"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "font-black text-xs uppercase underline tracking-wider whitespace-nowrap ml-4 transition-colors duration-700",
											style: { color: currentTheme.secondary },
											children: "ORDER NOW +"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 flex items-center justify-center relative min-h-[300px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: guarana_default,
											alt: "Guaraná Natural",
											className: "w-full max-w-[280px] h-auto object-contain mix-blend-multiply",
											style: { filter: "contrast(1.15) brightness(1.08)" }
										})
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "sobre",
					className: "border-y border-border bg-background py-20 sm:py-28",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Manifesto da chapa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "section-title",
							children: [
								"O sabor começa",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "no fogo" })
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-7 sm:grid-cols-2",
							children: [
								{
									n: "01",
									title: "Blend autoral",
									text: "Cortes selecionados, moídos todos os dias e moldados à mão."
								},
								{
									n: "02",
									title: "Calor de verdade",
									text: "Chapa de ferro em alta temperatura para a crosta perfeita."
								},
								{
									n: "03",
									title: "Origem local",
									text: "Pães, hortaliças e queijos de pequenos produtores parceiros."
								},
								{
									n: "04",
									title: "Sem atalhos",
									text: "Molhos, picles e acompanhamentos feitos dentro de casa."
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-primary",
										children: item.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 font-display text-xl font-bold uppercase",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: item.text
									})
								]
							}, item.n))
						})]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				id: "contato",
				className: "bg-surface-deep pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl gap-12 px-5 pb-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground",
								children: "Hambúrguer artesanal, fogo alto e hospitalidade para quem leva sabor a sério."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "outline",
									"aria-label": "Instagram",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "outline",
									"aria-label": "TikTok",
									className: "text-base font-black",
									children: "T"
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "footer-title",
							children: "Onde estamos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "footer-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-primary" }),
								" Rua das Brasas, 217",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Vila Madalena, São Paulo — SP"
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "footer-title",
							children: "Horários"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "footer-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4 text-primary" }),
								" Ter–Qui: 18h às 23h",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Sex–Dom: 12h às 00h"
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "footer-title",
							children: "Atalhos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "block hover:text-primary",
									href: "#cardapio",
									children: "Cardápio"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "block hover:text-primary",
									href: "#sobre",
									children: "Nossa história"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "block hover:text-primary",
									href: "mailto:oi@fogoechapa.com.br",
									children: "Fale com a gente"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "hover:text-primary",
									onClick: () => setAuthOpen(true),
									children: "Minha conta"
								})
							]
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-7xl flex-col gap-2 px-5 text-xs text-muted-foreground sm:flex-row sm:justify-between lg:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 Fogo e Chapa. Todos os direitos reservados." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Feito com fogo, ferro e respeito." })]
					})
				})]
			}),
			authOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {
				mode,
				setMode,
				onClose: () => setAuthOpen(false)
			})
		]
	});
}
function AuthModal({ mode, setMode, onClose }) {
	const [message, setMessage] = (0, import_react.useState)("");
	function submit(event) {
		event.preventDefault();
		setMessage("Demonstração visual — nenhuma conta foi criada.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-modal-backdrop p-4 backdrop-blur-md",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "auth-title",
		onMouseDown: (event) => event.target === event.currentTarget && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-panel relative w-full max-w-md overflow-hidden border border-border p-6 shadow-modal sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "absolute right-3 top-3",
					"aria-label": "Fechar",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-6 fill-current" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[0.16em] text-primary",
					children: "Acesso à mesa"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "auth-title",
					className: "mt-2 font-display text-3xl font-black uppercase",
					children: mode === "login" ? "Bem-vindo de volta" : "Entre para a brasa"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: mode === "login" ? "Acesse sua conta para acompanhar seus pedidos." : "Crie seu acesso e agilize os próximos pedidos."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 gap-2 rounded-sm border border-border bg-background/50 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: mode === "login" ? "fire" : "ghost",
						size: "sm",
						onClick: () => {
							setMode("login");
							setMessage("");
						},
						children: "Entrar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: mode === "signup" ? "fire" : "ghost",
						size: "sm",
						onClick: () => {
							setMode("signup");
							setMessage("");
						},
						children: "Cadastrar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4",
					children: [
						mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nome" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								maxLength: 80,
								autoComplete: "name",
								placeholder: "Seu nome"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "E-mail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								maxLength: 255,
								autoComplete: "email",
								placeholder: "voce@email.com"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Senha" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								minLength: 6,
								maxLength: 72,
								autoComplete: mode === "login" ? "current-password" : "new-password",
								placeholder: "••••••••"
							})] })]
						}),
						mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto block text-xs text-gold hover:text-primary",
							onClick: () => setMessage("Recuperação de senha disponível quando o acesso real for ativado."),
							children: "Esqueci minha senha"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							size: "lg",
							type: "submit",
							children: mode === "login" ? "Entrar" : "Criar conta"
						})
					]
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-sm border border-gold/30 bg-gold/10 p-3 text-xs text-gold",
					role: "status",
					children: message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
						" ou continue com ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setMessage("Google é apenas demonstrativo nesta versão."),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "G"
						}), " Google"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setMessage("Apple é apenas demonstrativo nesta versão."),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg",
							children: "●"
						}), " Apple"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-center text-[11px] leading-relaxed text-muted-foreground",
					children: "Demonstração visual. Nenhum dado é enviado ou armazenado."
				})
			]
		})
	});
}
//#endregion
export { Index as component };
