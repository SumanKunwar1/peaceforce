import type React from "react";
import Modal from "../../shared/Modal";
import DonationForm from "./DonationForm";
import type { ISupport } from "@/types/support";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportWay: ISupport["waysToSupport"][0] | null;
}

const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  supportWay,
}) => {
  if (!supportWay) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={supportWay.title}>
      <div className="space-y-6">
        <div className="aspect-w-16 aspect-h-9">
          {/* Note: The image property is not present in the waysToSupport type.
              If you want to include an image, you'll need to add it to the type definition. */}
          {/* <img
            src={supportWay.image || "/placeholder.svg"}
            alt={supportWay.title}
            className="w-full h-64 object-cover rounded-lg"
          /> */}
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-600">{supportWay.fullDescription}</p>
          <h3 className="text-xl font-semibold mt-6 mb-4">Benefits</h3>
          <ul className="list-disc list-inside space-y-2">
            {supportWay.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-600">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t pt-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Support Now</h3>
          <DonationForm supportType={supportWay.title} />
        </div>
      </div>
    </Modal>
  );
};

export default SupportModal;
