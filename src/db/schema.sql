-- SQLite
CREATE TABLE account(
    accountId TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT 0,
    parentId TEXT,
    
    FOREIGN KEY(parentId) REFERENCES parent(parentId)
)

CREATE TABLE parent(
    parentId TEXT NOT NULL PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    emailAddress TEXT NOT NULL,
    dateOfBirth TEXT NOT NULL,
    houseNumber TEXT NOT NULL,
    postcode TEXT NOT NULL,
    accountId TEXT NOT NULL,
    
    FOREIGN KEY(accountId) REFERENCES account(accountId)
)

CREATE TABLE session(
    sessionId TEXT NOT NULL PRIMARY KEY,
    date TEXT NOT NULL,
    startTime TEXT NOT NULL,
    length INTEGER NOT NULL,
    dateBooked TEXT NOT NULL,
    absent BOOLEAN NOT NULL DEFAULT 0,
    absenceCharge BOOLEAN NOT NULL DEFAULT 0, 
    absenceReason TEXT,
    absenceAdditionalInformation TEXT,
    absenceKeepSession BOOLEAN NOT NULL DEFAULT 1,
    isRecurring BOOLEAN NOT NULL DEFAULT 0, 
    childId TEXT NOT NULL,
    invoiceId TEXT,

    FOREIGN KEY(childId) REFERENCES child(childId),
    FOREIGN KEY(invoiceId) REFERENCES invoice(invoiceId)
)

CREATE TABLE expense(
    expenseId TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    cost INTEGER NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL, 
    supportingDocs TEXT,
    chargeToParents BOOLEAN NOT NULL DEFAULT 1,
    dateRecorded TEXT NOT NULL,
    invoiceId TEXT,

    FOREIGN KEY(invoiceId) REFERENCES invoice(invoiceId)
)

CREATE TABLE recurringSessionRequest(
    recurringSessionId TEXT NOT NULL PRIMARY KEY,
    approved BOOLEAN NOT NULL DEFAULT 0,
    recurringBasis TEXT NOT NULL DEFAULT "weekly",
    mondaySelected BOOLEAN NOT NULL DEFAULT 0,
    mondayStartTime TEXT,
    mondayEndTime TEXT,
    tuesdaySelected BOOLEAN NOT NULL DEFAULT 0,
    tuesdayStartTime TEXT,
    tuesdayEndTime TEXT,
    wednesdaySelected BOOLEAN NOT NULL DEFAULT 0,
    wednesdayStartTime TEXT,
    wednesdayEndTime TEXT,
    thursdaySelected BOOLEAN NOT NULL DEFAULT 0,
    thursdayStartTime TEXT,
    thursdayEndTime TEXT,
    fridaySelected BOOLEAN NOT NULL DEFAULT 0,
    fridayStartTime TEXT,
    fridayEndTime TEXT,    
    startTime TEXT NOT NULL,
    finishTime TEXT NOT NULL,
    dateRequestSubmitted TEXT NOT NULL,
    dateApproved TEXT NOT NULL,
    childId TEXT NOT NULL,

    FOREIGN KEY(childId) REFERENCES child(childId)
)

CREATE TABLE survey(
    surveyId TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    consentForm BOOLEAN NOT NULL DEFAULT 0,
    anonymous BOOLEAN NOT NULL DEFAULT 0, 
    numberOfQuestions INTEGER NOT NULL,
    dateCreated TEXT NOT NULL
)

CREATE TABLE surveyResponse(
    surveyResponseId TEXT NOT NULL PRIMARY KEY,
    dateRecorded TEXT NOT NULL,
    parentId TEXT NOT NULL,
    surveyId TEXT NOT NULL, 
    surveyQuestionId TEXT NOT NULL,
    surveyQuestionOptionId TEXT NOT NULL,

    FOREIGN KEY(parentId) REFERENCES parent(parentId),
    FOREIGN KEY(surveyId) REFERENCES survey(surveyId),
    FOREIGN KEY(surveyQuestionId) REFERENCES surveyQuestion(surveyQuestionId),
    FOREIGN KEY(surveyQuestionOptionId) REFERENCES surveyQuestionOption(surveyQuestionOptionId)
)

CREATE TABLE surveyIssue(
    surveyIssueId TEXT NOT NULL PRIMARY KEY,
    dateIssued TEXT NOT NULL,
    surveyId TEXT NOT NULL,
    parentId TEXT NOT NULL,

    FOREIGN KEY(surveyId) REFERENCES survey(surveyId),
    FOREIGN KEY(parentId) REFERENCES parent(parentId)
)

CREATE TABLE surveyQuestion(
    surveyQuestionId TEXT NOT NULL PRIMARY KEY,
    prompt TEXT NOT NULL,
    dateCreated TEXT NOT NULL,
    surveyId TEXT NOT NULL, 

    FOREIGN KEY(surveyId) REFERENCES survey(surveyId)
)

CREATE TABLE surveyQuestionOption(
    surveyQuestionOptionId TEXT NOT NULL PRIMARY KEY,
    prompt TEXT NOT NULL, 
    dateCreated TEXT NOT NULL,
    surveyQuestionId TEXT NOT NULL,

    FOREIGN KEY(surveyQuestionId) REFERENCES surveyQuestionOption(surveyQuestionId)
)

CREATE TABLE shortNoticeNotification(
    notificationId TEXT NOT NULL PRIMARY KEY,
    message TEXT NOT NULL,
    dateCreated TEXT NOT NULL
)

CREATE TABLE shortNoticeNotificationIssue(
    notificationIssueId TEXT NOT NULL PRIMARY KEY,
    allParents BOOLEAN NOT NULL DEFAULT 1,
    dateIssued TEXT NOT NULL,
    parentId TEXT NOT NULL,
    notificationId TEXT NOT NULL,

    FOREIGN KEY(parentId) REFERENCES parent(parentId),
    FOREIGN KEY(notificationId) REFERENCES shortNoticeNotification(notificationId)
)

CREATE TABLE twoWayMessage(
    messageId TEXT NOT NULL PRIMARY KEY,
    messageContent TEXT NOT NULL,
    fromOwner BOOLEAN NOT NULL DEFAULT 0,
    dateSent TEXT NOT NULL,
    parentId TEXT NOT NULL,

    FOREIGN KEY(parentId) REFERENCES parent(parentId)
)

CREATE TABLE child(
    childId TEXT NOT NULL PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    dateOfBirth TEXT NOT NULL,
    educationName TEXT,
    educationType TEXT NOT NULL,
    additionalNeedDesc TEXT,
    additionalNeedType TEXT NOT NULL,
    parentId TEXT NOT NULL,

    FOREIGN KEY(parentId) REFERENCES parent(parentId)
)

CREATE TABLE invoice(
    invoiceId TEXT NOT NULL PRIMARY KEY,
    dateGenerated TEXT NOT NULL,
    dateIssued TEXT NOT NULL,
    dateDue TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    includeExpenses BOOLEAN NOT NULL DEFAULT 1,
    additionalChargeName TEXT,
    additionalChargeAmount INTEGER,
    discountName TEXT,
    discountAmount INTEGER,
    message TEXT,
    total INTEGER NOT NULL,
    parentId TEXT NOT NULL,
    childId TEXT NOT NULL,

    FOREIGN KEY(parentId) REFERENCES parent(parentId),
    FOREIGN KEY(childId) REFERENCES child(childId)
)