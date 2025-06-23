import { getLesson, getUserProgress, getUserSubscribtion } from '@/db/queries'
import { redirect } from 'next/navigation';
import React from 'react'
import { Quiz } from '../quiz';

type Props = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async ({
  params,
}:Props) => {
  const lessonData = getLesson(params.lessonId);
  const userProgressData = getUserProgress();
  const userSubscribtionData = getUserSubscribtion();
  const [
    lesson,
    userProgress,
    userSubscribtion
  ] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscribtionData
  ]);
  if(!lesson || !userProgress) {
    redirect("/learn");
  }
  const initialPercentage = lesson.challenges
  .filter((challenge) => challenge.completed)
  .length / lesson.challenges.length * 100;
  return (
    <Quiz
     initialLessonId={lesson.id}
     initialLessonChallenges={lesson.challenges}
     initialHearts={userProgress.hearts}
     initialPercentage={initialPercentage}
     userSubscription={userSubscribtion}
    />
  );
};

export default LessonIdPage