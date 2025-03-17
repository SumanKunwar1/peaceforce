import { Contact, IContactData } from "../models";
import { userService } from "../services";
import { IContactInput } from "../types";
import mongoose from "mongoose";

class ContactService {
  async createContact(contactData: IContactInput): Promise<IContactData> {
    const { name, email, phoneNumber, message, page, pageTitle } = contactData;

    // Create a user associated with the contact
    const user = await userService.createUser({
      name,
      email,
      phoneNumber,
      page,
      pageTitle,
    });

    const contact = new Contact({
      userId: user._id,
      message,
    });

    await contact.save();

    return contact;
  }

  async getContacts(): Promise<IContactData[]> {
    return await Contact.find().populate("userId");
  }

  async getContactById(contactId: string): Promise<IContactData | null> {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new Error("Invalid contactId format.");
    }

    const contact = await Contact.findById(contactId).populate("userId");
    if (!contact) {
      throw new Error("Contact not found.");
    }

    return contact;
  }

  async deleteContact(contactId: string): Promise<IContactData | null> {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new Error("Invalid contactId format.");
    }

    const contactToDelete = await Contact.findById(contactId);

    if (!contactToDelete) {
      throw new Error("Contact not found.");
    }

    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      throw new Error("Contact not found.");
    }

    // Optionally delete the associated user
    await userService.deleteUser(contactToDelete.userId!.toString());

    return deletedContact;
  }
}

export const contactService = new ContactService();
