import re

def unspacify (s):
    return ''.join([ w.strip() for w in s.strip().split('\n') ])

tokenizer = re.compile(unspacify(r'''
    ([Cc]ourses?)|
    (:|
        \s+in\s+|\s+a\s+|\s+from\s+|\s+is\s+|\s+for\s+|
        (?:[,;]?\s+(?:and\s+)?)?[Ss]atisfaction\s+of\s+(?:the\s+)?Entry\s+Level\s+Writing(?:\s+and\s+Composition)?(?:\s+[Rr]equirements?)?|
        (?:pass\s+)?swimming(?:\s+ability|\s+skills\s+tests?\s+and\s+medical\s+clearance)|
        (?:graduate|upper).+standing|
        open\s+to\s+graduate\s+students|
        undergrads.+instructor|
        restricted.+students|
        completion.+requirements?|
        enrollment.+members?|
        enrolled.+meeting|
        score.+MPE\)|
        score.+higher|
        score.+of\s+\d+|
        equivalent|
        skills|
        math.+background|
        an\s+Undergraduate\s+Research\s+Contract.+department|
        the\s+following:|
        submission.+process|
        proposal.+supervise|
        approval.+major|
        approval.+preceptor|
        College.+Writing|
        Completion|
        satisfaction.+requirements?|
        permission.+department|
        intro.+classroom|
        for\s+an\s+understanding.+program|
        acceptance.+program|
        skill.+test|
        satisfaction.+requirement|
        in\s+the.+Program|
        (?:completing|enrollment).+instructor|
        basic.+assumed|
        consent.+(?:instructor|coordinator)|
        is.+course|
        prior.+enrollment\s+in|
        highly.+preparation|
        essay.+life|
        intro.+tion|
        by.+coordinator|
        college.+approval|approval.+college|
        suggested|
        college-level.+coursework|
        students.+instructor|
        previous.+enrollment\s+in|
        (?:is\s+restricted\s+to\s+)(?:feminist|psychology).+majors|
        (?:a\s+)score.+(?:higher|MPE\))|
        selection.+work|
        enrollment.+interview|
        high\s+school.+recommended|
        basic\s+college|
        in\s+ocean.+recommended|
        no.+quarter|
        core|
        university.+biology|
        operational.+language|
        interview.+meeting|
        must.+C\+\+|
        introductory\s+statistics\s+course\s+\(.+ent\)|
        \(|\)|
        research.+department|
        (?:or\s+)?(?:by\s+)?permission.+instructor|
        interview.+project|
        upper.+(?:recommended|supervise)|
        sumbission.+process|
        prior.+major|
        placement\s+by\s+examination|
        at\s+least\s+one\s+astronomy\s+course|
        \(or\s+equivalent\)|
        high-school\s+level\s+chemistry|
        pass(?:\s+in)?Swimming\s+Level\s+I+\s+course.+skills|
        (?:in\s+)freestyle.+breaststroke|
        (?:by\s+)?(?:consent|permission)?(?:\s+of(?:\s+the)?\s+instructor)?|
        instructor\s+determin(?:ation|es\s+skill\s+level)\s+at\s+first\s+class\s+meeting|
        [Bb]asic\s+knowledge\s+of\s+computer\s+programming\s+languages\s+is\s+assumed|
        basic\s+rowing|
        more\s+hours\s+of\s+club\s+keelboat\s+useage|
        advancement.+agency|
        (?:instructor ?)determination\s+at\s+first\s+class\s+meeting|
        a\s+writing.+meeting|
        intended.+only|
        mathematics\s+placement.+higher|
        interview.+materials|
        students.+agency|
        pass.+skills|
        interview.+preparedness|
        work.+interview|
        (?:a\s+)proposal.+supervise|
        instructor.+permission|
        open\s+only\s+Press|
        instructor.+level|
        certification.+clearance|
        special.+instructor|
        completion.+LA|
        interview.+only|
        excellent.+courses|
        enrollment.+majors|
        instructor.+required|
        for.+perission(?:.+enroll)?|
        or\s+.+equivalent|
        enroll.+seniors|
        concurrent.+enrollment|
        basic.+Fortran|
        calculus.+algebra|
        instructor.+approval|
        A\s+background.+programming|
        satisfactory.+exam|
        must.+(?:book|skills)|
        priority.+concentration|
        another\s+screenwriting\s+course|
        petition.+concentration\)?|
        history.+seminar|
        (?:one\s+year|years\s+of).+language|
        qualifications.+meeting|
        equivalent\s+skills|
        interview.+portfolio|
        (?:(?:a.+)?placement|AWPE).+score\s+of\s+\d+|
        taking.+recommended|
        approval\s+of\s+the\s+Writing\s+Program|
        [Pp]revious(?:\s+course\s+in\s+ocean\s+sciences)?|
        Basic\s+Scuba\s+Certification|
        Scuba|
        in\s+Oakes|
        approval.+provost|
        current.+leader|
        (?:a\s+)score\s+of\s+.+\(MPE\)|
        (?:one|two)\s+upper-division\s+history\s+courses|
        journalism\s+experience|
        (?:the\s+)?equivalent|
        essay.+member|
        a\s+proposal.+supervise|
        (?:determination|admission|audition).+meeting|
        placement\s+by\s+interview|
        proficiency\s+in\s+French|
        participation.+ACE|
        good\s+academic\s+standing|
        pass.+swimming|
        AP.+(?:higher|\d+)|
        one.+studies|
        enrollment\s+in|
        is\s+required|
        open.+Press|
        freestyle.+breaststroke|
        certification.+Program|
        consent.+instructor|
        Successful|
        the.+Program|
        satisfaction.+requirements|
        one.+additional.+course|
        required|experience|
        must.+concurrently|
        are.+recommended|
        an.+department|
        \s+any\s+|
        of.+the.+following|
        permission.+department|
        Entry.+requirements|
        successful.+core|
        at\s+least.+cour?ses|
        score.+\(MPE\)|
        of|
        score\s+of\s+\d+or\s+higher\s+on\s+the\s+mathematics\s+placement\s+examination\s+\(MPE\)|
        (?:is\s+)?(?:are\s+)?(?:strongly\s+)?recommended(?:\s+as\s+preparation)?|
        (?:is\s+)?[Rr]equire(?:d|ment)
        (?:enrollment.+|is.+restricted.+)?(?:seniors?|upper-division|graduate(?:\s+students?))(?:.+standing)?|
        higher|requirements|university.level.+biology|as.preparation|preferred|\(|\)|previous.or.concurrent.enrollment.in|ocean|[Ee]arth|
        intro.+tion|
        with.+adviser|
        highly.+this.course|
        prior.+this.course|
        sub.+supervise|
        work.+enroll|
        to.enroll|
        sciences.is.+recommended|
        non.sculpture.+studios.from|
        non.print.+studios.from|
        non.painting.+studios.from|
        non.photography.+studios.from|
        from:|
        per.+permission|
        probability.+background|
        basic.+systems|
        qualifications.+inquire.+office|
        or.by.permission.+instructor|
        familiarity.+C\+\+|
        exceptions.+instructor|
        computer.+elective|
        intro.CAL.+classroom|
        an.understanding.+program|
        grade.+better.in|
        are.required|
        per.+permission|
        exception.+instructor|
        restricted.+majors|
        intro.+tion|
        restricted.+seniors|
        psychology.+majors|
        upper.+course|
        as.+course|
        a.university.level.+instructor|
        as.prereq.+course|
        knowledge.+language|
        engagement.+research|
        petition.+agency|
        proof.+writing|
        see.+information|
        admission.+audition|
        strong.+recommended|
        application.+letter|
        folklore.+recommended|
        sponsoring.+approval|
        advancement.to.candidacy|
        instructoazr|
        for.+majors|
        a.+recommended|
        at.+language.+equivalent|
        knowledge.+language|
        instructor|
        petition.+agency|
        preparation|
        at.+following:|
        determination.+application;|
        a.college.level.calculus.course|
        intro.Spanish.+Examination|
    )|
    (\s+)|
    ((?:[A-Z][a-z]+(?:\s+and)?[\s/]+)*[A-Z][a-z]+|[A-Z]+)|
    (\d+[A-Z]?(?:[/-][A-Z])*)|
    ([;,]\s*(?:and|or)?)|
    (and|or)|
    ([Oo]ne|[Tt]wo)|
    (concurrent\s+enrollment\s+in)|
    (required)|
    (either)|
    (.+)
'''), re.DOTALL | re.VERBOSE)

assert(re.match(tokenizer, 'satisfaction of the Entry Level Writing and Composition requirements'))
assert(re.match(tokenizer, 'permission of instructor'))
assert(re.match(tokenizer, 'permission of the instructor'))


def parse_prereqs (prereqs, dept, depts):
    # print("Parsing '%s'"%prereqs)
    depts['course'] = dept
    depts['courses'] = dept
    course_prefix = "N/A "
    for match in re.finditer(tokenizer, prereqs):
        (course_keyword,
            ignore,
            whitespace,
            course, number,
            delims,
            and_or,
            one_from,
            concurrent,
            required,
            either,
            error
        ) = match.groups()
        if error:
            with open ('unparsed', 'a') as f:
                f.write(error+'\n')
            print("unparsed: '%s'"%error)
            # raise Exception("unmatched token(s) '%s' in '%s'"%(error, prereqs))
        elif course:
            course = course.strip()
            try:
                course_prefix = '%s '%depts[course].upper()
            except KeyError:
                pass
                # print("Unhandled course: '%s'"%course)
        elif number:
            pass
            # print(course_prefix+number)

