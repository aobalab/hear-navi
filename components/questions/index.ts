import type { ComponentType } from "react";

import AbstractQuestion from "@/components/questions/abstract";
import AgeQuestion from "@/components/questions/age";
import AiQuestion from "@/components/questions/ai";
import BackgroundQuestion from "@/components/questions/background";
import BudgetQuestion from "@/components/questions/budget";
import CompanyDetailQuestion from "@/components/questions/company-detail";
import GenderQuestion from "@/components/questions/gender";
import Impression1Question from "@/components/questions/impression1";
import Impression2Question from "@/components/questions/impression2";
import Impression3Question from "@/components/questions/impression3";
import PurposeQuestion from "@/components/questions/purpose";
import ScheduleQuestion from "@/components/questions/schedule";
import SelfIntroductionQuestion from "@/components/questions/self-introduction";
import SiteCategoryQuestion from "@/components/questions/site-category";
import SiteFunctionQuestion from "@/components/questions/site-function";
import SitePageQuestion from "@/components/questions/site-page";
import StatusQuestion from "@/components/questions/status";
import UserTypeQuestion from "@/components/questions/user-type";

export const questionComponents: Record<string, ComponentType> = {
    abstract: AbstractQuestion,
    age: AgeQuestion,
    ai: AiQuestion,
    background: BackgroundQuestion,
    budget: BudgetQuestion,
    "company-detail": CompanyDetailQuestion,
    gender: GenderQuestion,
    impression1: Impression1Question,
    impression2: Impression2Question,
    impression3: Impression3Question,
    purpose: PurposeQuestion,
    schedule: ScheduleQuestion,
    "self-introduction": SelfIntroductionQuestion,
    "site-category": SiteCategoryQuestion,
    "site-function": SiteFunctionQuestion,
    "site-page": SitePageQuestion,
    status: StatusQuestion,
    "user-type": UserTypeQuestion,
};