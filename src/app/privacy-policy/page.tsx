import Link from "next/link";
import React from "react";

const PrivacyPage = () => {
  return (
    <main className="w-screen min-h-screen flex flex-col mx-auto max-w-[40rem] p-12">
      <h1 className="font-bold text-3xl">Memoize Privacy Policy</h1>
      <h2 className="text-xl">Effective Date: 08/14/2024</h2>
      <br />
      <article>
        <p>
          This Privacy Policy outlines how Memoize collects, uses, discloses,
          and protects your personal information.
        </p>
        <br />
        <h3 className="font-bold">Information We Collect</h3>
        <p>
          We may collect personal information such as your name, email address,
          and usage data when you use our app.
        </p>
        <br />
        <h3 className="font-bold">How We Use Your Information</h3>
        <p>
          We use your information to provide and improve our app, personalize
          your experience, and for analytics purposes.
        </p>
        <br />
        <h3 className="font-bold">Data Sharing</h3>
        <p>
          We do not share your personal information with third parties, except
          as required by law or to provide services you have requested.
        </p>
        <br />
        <h3 className="font-bold">Data Security</h3>
        <p>
          We implement reasonable security measures to protect your personal
          information from unauthorized access, disclosure, or misuse.
        </p>
        <br />
        <h3 className="font-bold">Your Rights</h3>
        <p>
          You have the right to access, correct, or delete your personal
          information.
        </p>
        <br />
        <h3 className="font-bold">Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes.
        </p>
        <br />
        <h3 className="font-bold">Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <Link
            href="mailto://fakenamedev.com"
            className="text-blue-500 hover:text-blue-600 hover:underline"
          >
            fakenamedev.com
          </Link>
          .
        </p>
      </article>
    </main>
  );
};

export default PrivacyPage;
