import UserModel from "@/app/api/_models/User";
import { createRole, deleteRole } from "@/app/api/_services/role";
import { dbConnect } from "@/app/api/_utils";
import { Types } from "mongoose";
import { NextResponse, userAgent } from "next/server";
interface Params {
  roleId: string;
  ownerId: string;
}

/**
 * Handles the POST request for creating a role.
 * @param request - The request object containing the ownerId.
 * @returns A JSON response indicating the success or failure of the operation.
 */
export async function POST(request: Request) {
  const { ownerId } = await request.json();
  try {
    if (await UserModel.exists({ _id: ownerId })) {
      const role = await createRole(ownerId);
      UserModel.findByIdAndUpdate(ownerId, {
        $addToSet: { rolesId: { $each: [role._id] } },
      }).exec();
      return NextResponse.json({ message: "Role created" });
    } else {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}

/**
 * Deletes a role.
 *
 * @method
 * @async
 * @param request - The request object.
 * @returns A JSON response indicating the result of the deletion.
 */
export const DELETE = async (request: Request) => {
  const { id } = await request.json();
  try {
    await dbConnect();
    await deleteRole(id as Types.ObjectId);
    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
