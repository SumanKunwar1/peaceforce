import { IMembership, Membership } from "@models";
import { IMembershipInput } from "@typeInterface";
import { httpMessages } from "@utils/HttpMessage";

class MembershipService {
  async createMembership(
    membershipData: IMembershipInput
  ): Promise<IMembership> {
    try {
      const newMembership = new Membership({
        ...membershipData,
      });

      await newMembership.save();
      return newMembership;
    } catch (error) {
      console.error("Error creating membership:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getMemberships(): Promise<IMembership[]> {
    try {
      const memberships = await Membership.find();
      return memberships;
    } catch (error) {
      console.error("Error fetching memberships:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getMembershipById(membershipId: string): Promise<IMembership | null> {
    try {
      const membership = await Membership.findById(membershipId);
      if (!membership) {
        throw httpMessages.NOT_FOUND("MemberShip");
      }
      return membership;
    } catch (error) {
      console.error("Error fetching membership by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateMembership(
    membershipId: string,
    membershipData: IMembershipInput
  ): Promise<IMembership | null> {
    try {
      const updatedMembership = await Membership.findByIdAndUpdate(
        membershipId,
        membershipData,
        {
          new: true,
        }
      );

      if (!updatedMembership) {
        throw httpMessages.NOT_FOUND("MemberShip");
      }

      return updatedMembership;
    } catch (error) {
      console.error("Error updating membership:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteMembership(membershipId: string): Promise<IMembership | null> {
    try {
      const membership = await Membership.findById(membershipId);

      if (!membership) {
        throw httpMessages.NOT_FOUND("MemberShip");
      }

      const deletedMembership = await Membership.findByIdAndDelete(
        membershipId
      );
      if (!deletedMembership) {
        throw httpMessages.NOT_FOUND("MemberShip");
      }
      return deletedMembership;
    } catch (error) {
      console.error("Error deleting membership:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const membershipService = new MembershipService();
