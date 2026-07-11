/** @jsxImportSource react */
import { getContributions, loadGoogleFont } from "../utils"
import satori from "satori"
import { twj } from "tw-to-css"
import { Contributions } from "../types/interfaces"

// icons from https://fontawesome.com
function StarIcon({ size = 18, color = "#f1c40f" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    )
}

function CommitIcon({ size = 18, color = "#58a6ff" }: { size?: number; color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 640 640"><path d="M320 400C364.2 400 400 364.2 400 320C400 275.8 364.2 240 320 240C275.8 240 240 275.8 240 320C240 364.2 275.8 400 320 400zM476.8 352C462 425 397.4 480 320 480C242.6 480 178 425 163.2 352L64 352C46.3 352 32 337.7 32 320C32 302.3 46.3 288 64 288L163.2 288C178 215 242.6 160 320 160C397.4 160 462 215 476.8 288L576 288C593.7 288 608 302.3 608 320C608 337.7 593.7 352 576 352L476.8 352z"/></svg>
    )
}

function PullRequestIcon({ size = 18, color = "#3fb950" }: { size?: number; color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 640 640" fill={color}>
            <path d="M392 88C392 78.3 386.2 69.5 377.2 65.8C368.2 62.1 357.9 64.2 351 71L295 127C285.6 136.4 285.6 151.6 295 160.9L351 216.9C357.9 223.8 368.2 225.8 377.2 222.1C386.2 218.4 392 209.7 392 200L392 176L416 176C433.7 176 448 190.3 448 208L448 422.7C419.7 435 400 463.2 400 496C400 540.2 435.8 576 480 576C524.2 576 560 540.2 560 496C560 463.2 540.3 435 512 422.7L512 208C512 155 469 112 416 112L392 112L392 88zM136 144C136 130.7 146.7 120 160 120C173.3 120 184 130.7 184 144C184 157.3 173.3 168 160 168C146.7 168 136 157.3 136 144zM192 217.3C220.3 205 240 176.8 240 144C240 99.8 204.2 64 160 64C115.8 64 80 99.8 80 144C80 176.8 99.7 205 128 217.3L128 422.6C99.7 434.9 80 463.1 80 495.9C80 540.1 115.8 575.9 160 575.9C204.2 575.9 240 540.1 240 495.9C240 463.1 220.3 434.9 192 422.6L192 217.3zM136 496C136 482.7 146.7 472 160 472C173.3 472 184 482.7 184 496C184 509.3 173.3 520 160 520C146.7 520 136 509.3 136 496zM480 472C493.3 472 504 482.7 504 496C504 509.3 493.3 520 480 520C466.7 520 456 509.3 456 496C456 482.7 466.7 472 480 472z" />
        </svg>
    )
}

function StatRow({
    icon,
    label,
    value,
    accentColor
}: {
    icon: React.ReactNode
    label: string
    value: number
    accentColor: string
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.05)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: `${accentColor}22`, // subtle tinted background
                    }}
                >
                    {icon}
                </div>
                <span style={twj("text-sm text-white")}>{label}</span>
            </div>
            <span style={twj("text-sm text-gray-400")}>{value.toLocaleString()}</span>
        </div>
    )
}

export default async function Contributions(props: { username: string, token: string, bgColor: string }) {
    const contributions: Contributions = await getContributions(props.username, props.token)
    if (!contributions) throw new Error("Contributions.tsx - something went wrong with the langMap.")

    const fontData = await loadGoogleFont("Roboto")

    const isValidHex = props.bgColor && props.bgColor.length === 6
    const backgroundColor = isValidHex ? `#${props.bgColor}` : "#111827"

    const tsx = (
        <div style={{ ...twj(`w-96 rounded-md px-4 pb-4 pt-2`), backgroundColor, display: "flex", flexDirection: "column", height: 240 }}>
            <p style={twj("text-center text-white text-xl mb-3")}>{`${props.username}'s GitHub Contributions`}</p>

            <div style={{ ...twj("mt-1"), display: "flex", flexDirection: "column", gap: 6 }}>
                <StatRow
                    icon={<StarIcon />}
                    label="Stars earned"
                    value={contributions.stars}
                    accentColor="#f1c40f"
                />
                <StatRow
                    icon={<CommitIcon />}
                    label="Contributions"
                    value={contributions.contributions}
                    accentColor="#58a6ff"
                />
                <StatRow
                    icon={<PullRequestIcon />}
                    label="Pull requests"
                    value={contributions.pullRequests}
                    accentColor="#3fb950"
                />
            </div>
        </div>
    )

    const svg = await satori(tsx, {
        width: 400,
        height: 280,
        fonts: [
            { name: "Roboto", data: fontData, weight: 400, style: "normal" }
        ]
    })

    return svg
}