"use client";
import supabase from "@/libs/supabase";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import Loading from "@/app/loading";
import { convertDate } from "@/libs/util";

type Profile = Database["public"]["Tables"]["user"]["Row"];
interface DailyMission {
  id: string;
  uid: number;
  point: number;
  title: string;
  content: string;
  doingYn: boolean;
}
const SideBar = () => {
  const params = useParams().id as string;
  const decodedParams = decodeURIComponent(params);
  // console.log("params--->",params)
  console.log("decodedParams--->", decodedParams);
  const router = useRouter();
  // console.log("router--->",router)
  // searchId값을 그냥 params로 할당하느냐 decodedParams로 할당하느냐에 따라 결과가 달라짐. 아, eq 컬럼은 바꿔줘야 함.
  // const searchId = params as string
  const searchId = decodedParams as string;
  // console.log("searchId================================>",searchId)
  const getProfile = async (id: string) => {
    // let { data: user, error } = await supabase.from("user").select("*").eq("uid", id);
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("nickname", searchId);
    return user![0];
  };

  const [profile, setProfile] = useState<Profile>({});
  const [dailyMission, setDailyMission] = useState<DailyMission[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchedProfile = await getProfile(searchId);
      setProfile(fetchedProfile);
      // console.log("profile=>",profile)
    };
    fetchProfile();
  }, [searchId]);

  // const testId = "userId4"
  const insertMissionListData = async () => {
    const currentDate = convertDate(new Date());
    console.log("currentDate=>", currentDate);
    // let { data: missionListData, error } = await supabase.from("missionList").select("dailyMission").eq("createdAt", currentDate).eq("userId", testId)
    let { data: missionListData, error } = await supabase
      .from("missionList")
      .select("dailyMission")
      .eq("createdAt", currentDate)
      .eq("userId", searchId);
    console.log("missionListData==>", missionListData);
    // supabase가 데이터 return할 때 빈 값은 "무조건" 빈 배열[]로 반환하기 때문에, missionListData === null 인 경우가 없다고 타입선언.
    const myMissions =
      missionListData!.length == 0 ? [] : missionListData![0].dailyMission;
    console.log("myMissions===>", myMissions);
    if (myMissions.length > 0 && myMissions.length > 0) {
      console.log("myMissions==>", myMissions);
      setDailyMission(myMissions);
      return false;
    } else {
      try {
        let { data: mission, error } = await supabase
          .from("mission")
          .select("*");
        if (error) {
          console.error("Error fetching mission data:", error);
          return;
        }
        const randomMission = mission!
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        const newMission = [
          {
            userId: searchId,
            createdAt: convertDate(new Date()),
            dailyMission: randomMission,
          },
        ];

        const { data, error: insertError } = await supabase
          .from("missionList")
          .insert(newMission);

        if (insertError) {
          console.error("Error inserting data:", insertError);
        } else {
          setDailyMission(randomMission);
          console.log("Inserted data:", newMission);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };
  if (dailyMission) {
    console.log("dailyMission===>", dailyMission);
  } else {
    console.log("dailyMission 에러뜸");
  }

  return (
    <>
      {profile ? (
        <>
          <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 flex items-center justify-center">
            <img
              className="object-cover w-full h-full"
              src={profile.profileImage || ""}
              alt="이미지"
            />
          </div>
          <div>{profile.nickname}</div>
          <button
            onClick={() => router.push(`/profiletest/${searchId}/myprofile`)}
          >
            나의 프로필
          </button>
          <button
            onClick={() =>
              router.push(`/profiletest/${searchId}/mymission/missiondoing`)
            }
          >
            나의 미션
          </button>
          <button
            onClick={() =>
              router.push(`/profiletest/${searchId}/mycommunity/myposts`)
            }
          >
            커뮤니티 활동
          </button>
          <button
            onClick={() => {
							// 일일미션 뽑기 함수
              insertMissionListData();
							// 일일미션 모달 띄우기
              setShowModal(true);
            }}
          >
            일일미션 뽑기
          </button>

          {showModal && (
            <>
              <div onClick={() => setShowModal(false)} className="h-screen flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-screen my-6 mx-auto max-w-3xl ">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/* 모달 body */}
                    <div className="relative p-6 flex-auto h-3/4 ">
                      <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                        <section className="bg-pink-900 h-full flex justify-center items-center gap-x-16 text-white">
                          {dailyMission.map((missionItem) => (
                            <div
                              key={missionItem.id}
                              className="w-[300px] h-[420px] bg-transparent cursor-pointer group perspective"
                            >
                              <div className="relative preserve-3d my-rotate-y-180 w-full h-full">
                                <div className="absolute w-full h-full my-rotate-y-180-withoutkey bg-gray-100">
                                  <div className="text-center flex flex-col items-center justify-center h-full text-gray-800 px-2 pb-24">
                                    <h1 className="text-3x1 font-semibold">
                                      {missionItem.id}
                                    </h1>
                                    <p className="my-2">{missionItem.title}</p>
                                    <p className="my-2">
                                      {missionItem.content}
                                    </p>
                                  </div>
                                </div>
                                <div className="absolute backface-hidden border-2 w-full h-full">
                                  <img
                                    src="https://mblogthumb-phinf.pstatic.net/20160817_259/retspe_14714118890125sC2j_PNG/%C7%C7%C4%AB%C3%F2_%281%29.png?type=w800"
                                    className="w-full h-full"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </section>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      {/* <button
                        className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Submit
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  );
};
export default SideBar;
