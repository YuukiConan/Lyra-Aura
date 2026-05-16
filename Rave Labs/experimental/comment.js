document.addEventListener('DOMContentLoaded', () => {
    fetch('./Elements/comments.html').then(response => response.text())
    .then(data => {
        document.querySelector('.comment').innerHTML = data;

        const commentList = document.querySelectorAll('.comment-lists');
        const commentText = document.getElementById('message');
        const email = document.getElementById('email');
        const name  = document.getElementById('name');
        const submitButton = document.getElementById('submit');
        const port = 3000;
        
        if (name.value === '' || commentText.value === '') {
            function callToast(message, type = 'info', duration = 3000) {
                const show = () => {
                    if (typeof startToast !== 'undefined') {
                        startToast(message, type, duration);
                    }
                };

                // Check if toast script is already loaded
                if (typeof startToast === 'undefined') {
                    const script = document.createElement('script');
                    script.src = './toast.js'; // 👈 Adjust if needed
                    script.onload = show;

                    // Optional: prevent double loading
                    script.id = 'toast-script';
                    if (!document.getElementById('toast-script')) {
                        document.head.appendChild(script);
                    }
                } else {
                    show();
                }
            }
        }

        function isFormValid() {
            if (name.value === '' || commentText.value === '') {
                callToast('Please fill in all fields.', 'error');
                return false;
            }

            return true;
        }

        function appendComment(comment) {
            const newCommentEl = document.createElement('div');
            newCommentEl.classList.add('comment-panel');

            const yourName = document.createElement('div');
            yourName.classList.add('comment-name');
            yourName.innerHTML = `<strong>${comment.name}</strong>`;
            newCommentEl.appendChild(yourName);

            if (comment.timestamp) {
                const timestamp = document.createElement('div');
                const date = new Date(comment.timestamp);
    
                if (!isNaN(date.getTime())) {
                    const current_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
                    const current_time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                    const date_time = `${current_date} ${current_time}`;
                    timestamp.classList.add('comment-timestamp')
                    timestamp.innerHTML = date_time;
                    newCommentEl.appendChild(timestamp);
                } else {
                    console.error('Invalid date format:', comment.timestamp)
                }
            }

            const yourText = document.createElement('div');
            yourText.classList.add('comment-text');
            yourText.innerHTML = `${comment.text}`;
            newCommentEl.appendChild(yourText);

            const commentOption = document.createElement('div');
            commentOption.classList.add('comment-option');
            commentOption.innerHTML = `<button class="btn"><i class="uil uil-ellipsis-v"></i></button>`;
            yourText.appendChild(commentOption);

        
            const dropDownContent = document.createElement('div');
            dropDownContent.classList.add('drop-down-content');
            const btn1 = document.createElement('button');
            const btn2 = document.createElement('button');
            for (const btns of [btn1, btn2]) {
                btns.classList.add('drop-down-button')
            }
            btn1.innerHTML = 'Report'
            btn2.innerHTML = 'Copy'
            dropDownContent.appendChild(btn1);
            dropDownContent.appendChild(btn2);
            commentOption.appendChild(dropDownContent);
            
            commentOption.addEventListener('click', (e) => {
                e.preventDefault();
                dropDownContent.classList.add('flex');
            })
            commentOption.addEventListener('focusout', (e) => {
                e.preventDefault();
                dropDownContent.classList.remove('flex');
            })
            btn2.addEventListener('click', () => {
                navigator.clipboard.writeText(yourText);
            })

            commentList.forEach(list => {
                list.appendChild(newCommentEl);
            })
        }

        async function fetchComments() {
            try {
                const response = await fetch(`http://localhost:${port}/saved-comment`);
                if (response.ok) {
                    const comments = await response.json();
                    comments.forEach(com => appendComment(com));
                } else {
                    console.error('Error fetching comments:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }

        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();

            if (!isFormValid()) return;

            const nameValue = name.value.trim();
            const commentValue = commentText.value.trim();
            const emailValue = email.value.trim();
            
            try {
                const response = await fetch(`http://localhost:${port}/saved-comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameValue,
                        email: emailValue,
                        comment: commentValue
                    })
                });

                if (response.ok) {
                    const { newComment } = await response.json();
                    appendComment(newComment);
                    
                } else {
                    console.error('Error saving comment:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                
            commentText.value = '';
            email.value = '';
            name.value = '';
            }
        });

        fetchComments();
    })
});