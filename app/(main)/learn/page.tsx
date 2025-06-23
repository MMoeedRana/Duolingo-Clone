import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import React from 'react'
import Header from './header'
import UserProgress from '@/components/user-progress'
import { 
  getCourseProgress, 
  getLessonPercentage, 
  getUnits, 
  getUserProgress, 
  getUserSubscribtion
} from '@/db/queries'
import { redirect } from 'next/navigation'
import { Unit } from './unit'
import { lessons, units as unitsSchema } from '@/db/schema'
import { Promo } from '@/components/promo'
import { Quests } from '@/components/quests'

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseprogressdata = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscribtionData = getUserSubscribtion();
  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscribtion
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseprogressdata,
    lessonPercentageData,
    userSubscribtionData
  ]);
  if(!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }
  if(!courseProgress) {
    redirect("/courses");
  }
  const isPro = !!userSubscribtion?.isActive;
  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress 
        activeCourse={userProgress.activeCourse}
        hearts={userProgress.hearts}
        points={userProgress.points}
        hasActiveSubscribtion={isPro}
        />
        {!isPro && (
          <Promo />
        )}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className='mb-10'>
            <Unit 
            id={unit.id}
            order={unit.order}
            description={unit.description}
            title={unit.title}
            lessons={unit.lessons}
            activeLesson={courseProgress.activeLesson as typeof lessons.
              $inferSelect & {
                unit: typeof unitsSchema.$inferSelect;
              } | undefined}
            activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
