import MembershipForm from "@/components/membership/MembershipForm";

const About = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Membership Application
      </h1>
      <MembershipForm
        onSuccess={() => {
          // Handle success (e.g., show a success message, redirect to a thank you page)
          console.log("Membership form submitted successfully");
        }}
      />
    </div>
  );
};

export default About;
