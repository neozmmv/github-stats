/** @jsxImportSource react */
import { getLanguageMap, loadGoogleFont } from "../utils"
import satori from "satori"
import { twj } from "tw-to-css"

export default async function UserBanner(props: { username: string, token: string, bgColor: string }) {
    const langMap = await getLanguageMap(props.username, props.token)
    if (!langMap) throw new Error("UserBanner.tsx - something went wrong with the langMap.")

    let backColor = "bg-gray-900"
    if (props.bgColor && props.bgColor.length === 7 && props.bgColor.startsWith("#")) {
        backColor = `bg-[${props.bgColor}]`
    }

    const top5langs = [...langMap.entries()].slice(0, 5)
    const total = top5langs.reduce((sum, [, data]) => sum + data.size, 0)
    const fontData = await loadGoogleFont("Roboto")

    const isValidHex = props.bgColor && props.bgColor.length === 6
    const backgroundColor = isValidHex ? `#${props.bgColor}` : "#111827"

    const tsx = (
        <div style={{ ...twj(`w-96 rounded-md px-4 pb-4 pt-2`), backgroundColor, display: "flex", flexDirection: "column" }}>
            <p style={twj("text-center text-white text-xl mb-3")}>Most used languages</p>

            <div style={{ ...twj("w-full h-3 rounded-full overflow-hidden"), display: "flex" }}>
                {top5langs.map(([name, data]) => {
                    const percentage = (data.size / total) * 100
                    return (
                        <div style={{ width: `${percentage}%`, backgroundColor: data.color, height: "100%" }} />
                    )
                })}
            </div>

            <div style={{ ...twj("mt-3"), display: "flex", flexDirection: "column", gap: 4 }}>
                {top5langs.map(([name, data]) => {
                    const percentage = ((data.size / total) * 100).toFixed(1)
                    return (
                        <div style={{ ...twj("justify-between text-sm text-white"), display: "flex", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ ...twj("w-3 h-3 rounded-full"), backgroundColor: data.color }} />
                                <span>{name}</span>
                            </div>
                            <span style={twj("text-gray-400")}>{percentage}%</span>
                        </div>
                    )
                })}
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