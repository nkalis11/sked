import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationMembershipResource } from "@clerk/types";

export default function InviteMember() {
    const { organization } = useOrganization();
    const [emailAddress, setEmailAddress] = useState("");
    const [role, setRole] = useState<"basic_member" | "admin">("basic_member");
    const [disabled, setDisabled] = useState(false);

    return (
        <form>
            <input 
                type="text"
                placeholder="Email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
            />
            <label>
                <input
                    type="radio"
                    checked={role === "admin"}
                    onChange={() => {
                        setRole("admin");
                    }}
                />{" "}
                Admin
            </label>
            <label>
                <input
                    type="radio"
                    checked={role === "basic_member"}
                    onChange={() => {
                        setRole("basic_member");
                    }}
                />{" "}
                Member
            </label>{" "}
            <button type="submit" disabled={disabled}>
                Invite
            </button>
        </form>
    );
}
