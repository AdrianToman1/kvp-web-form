export const create = (feedback) => {
    return fetch('feedback',
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback)
        }).then((response) => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 400) {
            throw new Error("Bad Request");
        } else {
            throw new Error('Something went wrong');
        }
    });
};