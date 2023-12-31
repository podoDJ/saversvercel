"use client";
import FloatingButton from "@/components/community/FloatingButton";
import SideBar from "@/components/community/SideBar";
import { useAuth } from "@/hooks/useAuth";

const CommunityLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth();
  return (
    <div className="flex w-full">
      <div className="w-[379px] mt-24 h-full">
        <SideBar />
      </div>
      <section className="w-[789px]">{children}</section>
      {user ? (
        <FloatingButton href="/community/write">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </FloatingButton>
      ) : null}
    </div>
  );
};

export default CommunityLayout;
