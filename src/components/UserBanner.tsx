
export default function UserBanner(props: {username: string}) {
    return (
        <div>
            <h1>Hello, {props.username}</h1>
        </div>
    )
}