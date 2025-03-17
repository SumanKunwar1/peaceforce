import { ITeamData, Team } from "@models";
import { ITeamInput } from "@typeInterface";
import { httpMessages } from "@utils/HttpMessage";
import { deleteFile } from "@utils/deleteFile";

class TeamService {
  async createTeamMember(teamMemberData: ITeamInput): Promise<ITeamData> {
    try {
      const newTeamMember = new Team({
        ...teamMemberData,
      });

      await newTeamMember.save();
      return newTeamMember;
    } catch (error) {
      console.error("Error creating team member:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getTeamMembers(): Promise<ITeamData[]> {
    try {
      const teamMembers = await Team.find();
      return teamMembers.map((member: ITeamData) => {
        const teamMember = member.toObject();
        return {
          ...teamMember,
          image: teamMember.image
            ? `/api/image/${teamMember.image}`
            : teamMember.image,
        } as ITeamData;
      });
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getTeamMemberById(teamMemberId: string): Promise<ITeamData | null> {
    try {
      const teamMember = await Team.findById(teamMemberId);
      if (!teamMember) {
        throw httpMessages.USER_NOT_FOUND("Team member");
      }
      const teamMemberObj = teamMember.toObject();
      if (teamMemberObj.image) {
        teamMemberObj.image = `/api/image/${teamMemberObj.image}`;
      }
      return teamMemberObj;
    } catch (error) {
      console.error("Error fetching team member by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateTeamMember(
    teamMemberId: string,
    teamMemberData: ITeamInput
  ): Promise<ITeamData | null> {
    try {
      const existingTeamMember = await Team.findById(teamMemberId);
      if (!existingTeamMember) {
        throw httpMessages.USER_NOT_FOUND("Team member");
      }

      // Handle image field
      if (teamMemberData.image) {
        console.log("Processing image field...");

        if (teamMemberData.image === "") {
          console.log(
            "Image field is empty. Deleting existing image if present..."
          );

          if (existingTeamMember.image) {
            console.log(`Deleting existing image: ${existingTeamMember.image}`);
            await deleteFile(existingTeamMember.image);
          }
          teamMemberData.image = ""; // Set empty string
          console.log("Image has been cleared.");
        } else if (!teamMemberData.image.startsWith("/api/image/")) {
          console.log(
            "Image URL seems to be a new file path, updating image..."
          );

          if (existingTeamMember.image) {
            console.log(`Deleting old image: ${existingTeamMember.image}`);
            await deleteFile(existingTeamMember.image);
          }

          console.log(`New image file: ${teamMemberData.image}`);
        }
      }

      // Update the team member in the database
      const updatedTeamMember = await Team.findByIdAndUpdate(
        teamMemberId,
        teamMemberData,
        { new: true }
      );

      if (!updatedTeamMember) {
        throw httpMessages.USER_NOT_FOUND("Team member");
      }

      return updatedTeamMember;
    } catch (error) {
      console.error("Error updating team member:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteTeamMember(teamMemberId: string): Promise<ITeamData | null> {
    try {
      const teamMemberToDelete = await Team.findById(teamMemberId);
      if (!teamMemberToDelete) {
        throw httpMessages.USER_NOT_FOUND("Team member");
      }

      // Delete image file if it exists
      if (teamMemberToDelete.image) {
        await deleteFile(teamMemberToDelete.image);
      }

      // Delete the team member itself
      await Team.findByIdAndDelete(teamMemberId);

      return teamMemberToDelete;
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const teamService = new TeamService();
