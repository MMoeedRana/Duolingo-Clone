import { FeedWrapper } from '@/components/feed-wrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { getUserProgress, getUserSubscribtion } from '@/db/queries';
import { userProgress, userSubscribtion } from '@/db/schema';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'
import { Items } from './items';
import UserProgress from '@/components/user-progress';
import { Promo } from '@/components/promo';
import { Quests } from '@/components/quests';

const ShopPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscribtionData = getUserSubscribtion();
  const [
    userProgress,
    userSubscribtion,
  ] = await Promise.all([
    userProgressData,
    userSubscribtionData
  ]);
  if(!userProgress || !userProgress.activeCourse) {
    redirect("/courses")
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
        <div className='w-full flex flex-col items-center'>
          <Image 
           src="/shop.svg"
           alt='Shop'
           width={90}
           height={90}
          />
          <h1 className='text-center font-bold text-neutral-800 text-2xl my-6'>
            Shop
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            Spend your points on cool stuff.
          </p>
          <Items 
           hearts={userProgress.hearts}
           points={userProgress.points}
           hasActiveSubscribtion={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage