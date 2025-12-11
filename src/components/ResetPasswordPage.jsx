import { useParams } from "react-router-dom";

export default function ResetPasswordPage() {
    const { token } = useParams();

    return (
        <div style={{ padding: "40px" }}>
            <h1>Reset Password Page</h1>
            <p>Your token: {token}</p>
        </div>
    );
}
