export const StringValue = {
    DOC_LINK: ':doc-link',
    BODIES: ':bodies',
    ISSUE_PREFIX: ':issue-prefix'
};

export const DocMessage = {
    REFERENCE_TO_DOC: `Please, read: ${StringValue.DOC_LINK}`
};

export const StatusMessage = {
    VALID: '✔ Commit is valid',
    INVALID: '✘ Commit error'
};

export const ErrorMessage = {
    ISSUE_PREFIX_ERROR: `${StatusMessage.INVALID}\n Issue prefix "${StringValue.ISSUE_PREFIX}" \
    doesn\'t match the requirements. \n ${DocMessage.REFERENCE_TO_DOC}`,
    BODIES_ERROR: `${StatusMessage.INVALID}\n These bodies: "${StringValue.BODIES}" don\'t match the requirements.\ 
    \n ${DocMessage.REFERENCE_TO_DOC}`
};
