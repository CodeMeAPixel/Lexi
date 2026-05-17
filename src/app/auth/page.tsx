"use client";

import { useRouter } from "next/navigation";
import { HiMiniSparkles } from "react-icons/hi2";
import Image from "next/image";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export default function AuthBase() {
  const router = useRouter();

  const goSignin = () => router.push("/auth/signin");
  const goSignup = () => router.push("/auth/signup");
  return (
    <main className="panel-wide">
      <div className="p-6 mx-auto glass-panel">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/logo.png"
            alt="Lexi Logo"
            width={120}
            height={120}
            className="rounded"
          />

          <div className="text-center md:text-left">
            <h1 className="mb-1 text-3xl font-semibold">
              Welcome to Lexicon👋
            </h1>
            <p className="text-sm text-white/70">
              Select an option below and start improving your English skills
              today!
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button type="button" onClick={goSignin} className="btn-primary">
            <HiMiniSparkles size={18} /> I have an account
          </button>
          <button type="button" onClick={goSignup} className="btn-primary">
            <HiMiniSparkles size={18} /> I don't have an account
          </button>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">
            Frequently asked questions
          </h2>
          <div className="space-y-2">
            <Accordion className="space-y-2">
              <AccordionItem title="Is my data private?">
                <>
                  <p>
                    Yes, we only process your inputs to provide the service and
                    do not sell your data or share it with OpenAI.
                  </p>
                  <p className="mt-2">
                    Read more in our{" "}
                    <a className="underline text-sky-500" href="/legal/privacy">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </>
              </AccordionItem>

              <AccordionItem title="I forgot my password">
                <p>
                  You can use our{" "}
                  <a className="underline text-sky-500" href="/auth/forgot">
                    Forgot My Password
                  </a>{" "}
                  page to send yourself a password reset request!
                </p>
              </AccordionItem>

              <AccordionItem title="Is Lexi free to use?">
                <>
                  <p>
                    Yes, Lexi is 100% free to use and will remain free for the
                    foreseeable future.
                  </p>
                  <p className="mt-2">
                    We may introduce optional paid features later, but the core
                    learning tools/APIs will remain available at no cost.
                  </p>
                </>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>
    </main>
  );
}
