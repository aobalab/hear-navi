import type { ComponentType } from "react";

import SelfIntroductionRequirementsQuestion from "@/components/questions/01-requirements/01-self-introduction";
import CompanyDetailQuestion from "./01-requirements/02-company-detail";
import BackgroundQuestion from "./01-requirements/03-background";
import AiQuestion from "@/components/questions/01-requirements/05-ai";
import UserTypeQuestion from "@/components/questions/02-target/01-user-type";
import GenderQuestion from "@/components/questions/02-target/02-gender";
import AgeQuestion from "@/components/questions/02-target/03-age";
import StatusQuestion from "@/components/questions/02-target/04-status";
import SiteCategoryQuestion from "@/components/questions/03-function/01-site-category";
import SitePageQuestion from "@/components/questions/03-function/02-site-page";
import SiteFunctionQuestion from "@/components/questions/03-function/03-site-function";
import AbstractQuestion from "@/components/questions/04-image/01-abstract";
import Impression1Question from "@/components/questions/04-image/02-impression1";
import Impression2Question from "@/components/questions/04-image/03-impression2";
import Impression3Question from "@/components/questions/04-image/04-impression3";
import ScheduleQuestion from "@/components/questions/05-proposal/01-schedule";
import BudgetQuestion from "@/components/questions/05-proposal/02-budget";

export const questionComponents: Record<string, Record<string, ComponentType>> = {
    requirements: {
        "self-introduction": SelfIntroductionRequirementsQuestion,
        background: BackgroundQuestion,
        "company-detail": CompanyDetailQuestion,
        ai: AiQuestion,
    },
    target: {
        "user-type": UserTypeQuestion,
        gender: GenderQuestion,
        age: AgeQuestion,
        status: StatusQuestion,
    },
    function: {
        "site-category": SiteCategoryQuestion,
        "site-page": SitePageQuestion,
        "site-function": SiteFunctionQuestion,
    },
    image: {
        abstract: AbstractQuestion,
        impression1: Impression1Question,
        impression2: Impression2Question,
        impression3: Impression3Question,
    },
    proposal: {
        schedule: ScheduleQuestion,
        budget: BudgetQuestion,
    },
};