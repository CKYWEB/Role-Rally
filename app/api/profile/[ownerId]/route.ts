import { handler } from "@/app/api/_middleware/handler";
import { validateTokenMiddleware } from "@/app/api/_middleware/user";
import ProfileModel from "@/app/api/_models/Profile";
import { dbConnect } from "@/app/api/_utils";
import { NextRequest, NextResponse } from "next/server";
import { sendbirdRequests } from "@/app/_lib/sendbird";

type Params = {
  ownerId: string | undefined;
};

/**
 * Updates the profile of a user with the specified ownerId.
 *
 * @method
 * @async
 * @param req - The NextRequest object representing the incoming request.
 * @param params - An object containing the route parameters, including the ownerId.
 * @returns A NextResponse object containing the updated profile.
 */
const updateProfile = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  const { ownerId } = params;

  try {
    // TODO: validate ownerId

    const body = await req.json();

    await dbConnect();
    const profile = await ProfileModel.findOneAndUpdate(
      { ownerRoleId: ownerId },
      body,
      {
        new: true,
      }
    ).exec();

    await sendbirdRequests.updateUser({
      user_id: profile.ownerRoleId,
      nickname: profile.firstName,
      profile_url: profile.avatar,
    });
    
    return NextResponse.json({
      profile: profile?.toObject(),
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ status: 500 });
  }
};

export const PUT = handler(validateTokenMiddleware, updateProfile);
