import React from "react";

const Profile = () => {
    return (
        <div>
            <h1>Profile</h1>
            <button onClick={() => {
                localStorage.clear()
                window.location.href = '/'
            }} className="btn btn-danger">
                Logout
            </button>
        </div>
    )
}

export default Profile