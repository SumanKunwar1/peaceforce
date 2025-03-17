import { Donation, IDonationData, IUser } from "@models";
import { userService } from "@services";
import { IDonationInput } from "@typeInterface";
import { httpMessages } from "@utils/HttpMessage";
import mongoose from "mongoose";

class DonationFormService {
  async createDonation(donationData: IDonationInput): Promise<IDonationData> {
    const { amount, name, email, phoneNumber, page, pageTitle, screenshot } =
      donationData;

    const user = await userService.createUser({
      name,
      email,
      phoneNumber,
      page,
      pageTitle,
      role: "donator",
    });

    const donationForm = new Donation({
      userId: user._id,
      amount,
      screenshot,
    });

    await donationForm.save();

    return donationForm;
  }

  async getDonations(): Promise<IDonationData[]> {
    const donations = await Donation.find().populate("userId");
    return donations.map((donation) => {
      const donationObj = donation.toObject();
      return {
        ...donationObj,
        screenshot: donationObj.screenshot
          ? `/api/image/${donationObj.screenshot}`
          : donationObj.screenshot,
      } as IDonationData;
    });
  }

  async getDonationById(donationId: string): Promise<IDonationData | null> {
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      throw httpMessages.BAD_REQUEST("Invalid donationId format.");
    }

    const donationForm = await Donation.findById(donationId).populate("userId");
    if (!donationForm) {
      throw httpMessages.NOT_FOUND("Donation form not found.");
    }

    const donationObj = donationForm.toObject();
    donationObj.screenshot = donationObj.screenshot
      ? `/api/image/${donationObj.screenshot}`
      : donationObj.screenshot;

    return donationForm;
  }

  async deleteDonation(donationId: string): Promise<IDonationData | null> {
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      throw httpMessages.BAD_REQUEST("Invalid donationId format.");
    }

    const donationFormToDelete = await Donation.findById(donationId);
    if (!donationFormToDelete) {
      throw httpMessages.NOT_FOUND("Donation form not found.");
    }

    const deletedDonationForm = await Donation.findByIdAndDelete(donationId);
    if (!deletedDonationForm) {
      throw httpMessages.NOT_FOUND("Donation form not found.");
    }

    // await userService.deleteUser(donationFormToDelete.userId!.toString());

    return deletedDonationForm;
  }
}

export const donationService = new DonationFormService();
