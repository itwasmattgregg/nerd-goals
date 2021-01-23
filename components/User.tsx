import React from "react";
import Link from "next/link";
import { Goal, Tech, User as UserModel } from "@prisma/client";

export interface UserProps extends UserModel {
  technologies?: Tech[];
  goals?: Goal[];
}

const User: React.FC<{ user: UserProps }> = ({ user }) => {
  return (
    <Link href={`/user/${user.id}`}>
      <a>
        <h2>{user.name}</h2>
        <p>{user.createdAt.toString()}</p>
      </a>
    </Link>
  );
};

export default User;
