import Link from "next/link";

const Footer = () => {
  return (
    <main className="w-screen h-12 py-1 px-12 flex justify-center gap-10">
      <p>
        Copyright &copy; 2024 Memoize. All Rights Reserved.&nbsp;|&nbsp;
        <Link
          href="/privacy-policy"
          className="text-blue-500 hover:text-blue-600 hover:underline"
        >
          View Privacy Policy
        </Link>
      </p>
      <p>
        Designed and Developed by{" "}
        <Link href="mailto://fakenamedev@gmail.com">fakenamedev</Link>
      </p>
    </main>
  );
};

export default Footer;
