import React from "react";
import Link from "next/link";
import { User as UserModel } from "@prisma/client";

const User: React.FC<{ user: UserModel }> = ({ user }) => {
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
