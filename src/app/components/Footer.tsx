import Link from "next/link";

const Footer = () => {
  return (
    <main className="w-screen h-auto py-1 px-2 md:px-12 flex flex-col md:flex-row items-center justify-center md:gap-10 text-[0.55rem] lg:text-[0.8rem]">
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
