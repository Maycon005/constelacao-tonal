export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#050711",
                nebula: "#0a1023",
                cyanGlow: "#58ddff",
                electric: "#6992ff",
                aurora: "#cb7cff",
                mintRest: "#8df7c6",
                warmth: "#ffd071",
                bloom: "#ff8bc7"
            },
            boxShadow: {
                glow: "0 0 0 1px rgba(103, 182, 255, 0.15), 0 12px 40px rgba(6, 12, 30, 0.52)",
                neon: "0 0 25px rgba(88, 221, 255, 0.22)"
            },
            backgroundImage: {
                grid: "linear-gradient(rgba(103,146,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(103,146,255,0.08) 1px, transparent 1px)"
            }
        }
    },
    plugins: []
};
