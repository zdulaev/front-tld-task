document.addEventListener('DOMContentLoaded', function() {
    init();

    // window.addEventListener('resize', function(event){
    //     setViewButton();
    // });
});

function setViewButton() {
    document.querySelectorAll('.js-masked[data-max-height]').forEach((item, i) => {
        const mh = +item.getAttribute('data-max-height'),
        sh =  item.scrollHeight;

        if (sh > mh && !item.querySelector('.view-all')) {
            let viewer = document.createElement('div');

            viewer.classList.add('view-all');
            viewer.innerHTML = '...';

            // destroy view button
            viewer.onclick = function() {
                item.style.maxHeight = 'none';
                item.classList.remove('js-masked');
                item.removeAttribute('data-max-height');
            
                this.remove();
            }
            item.append(viewer);
        }
        
    });
}

function init() {
    setViewButton();
    burger('.burger');
    closeOutClick(document.querySelector('.burger-search'));
    closeOutClick(document.querySelector('.burger-main'));
    // scroll('.tags');
}

function scroll(target, fast = 1) {
    const elems = document.querySelectorAll(target);
    let isDown = false;
    let startX;
    let scrollLeft;

    elems.forEach((item, i) => {
        item.addEventListener('mousedown', (e) => {
            isDown = true;
            item.classList.add('active');
            startX = e.pageX - item.offsetLeft;
            scrollLeft = item.scrollLeft;
        });
        item.addEventListener('mouseleave', () => {
            isDown = false;
            item.classList.remove('active');
        });
        item.addEventListener('mouseup', () => {
            isDown = false;
            item.classList.remove('active');
        });
        item.addEventListener('mousemove', (e) => {
            if(!isDown) return;

            e.preventDefault();
            const x = e.pageX - item.offsetLeft;
            const walk = (x - startX) * fast;
            item.scrollLeft = scrollLeft - walk;
        });
    });
}

function burger(target) {
    const elems = document.querySelectorAll(target);

    elems.forEach((item, i) => {
        item.addEventListener('click', () => {
            document.querySelectorAll(
                item.getAttribute('data-selector')
            ).forEach((item) => item.classList.toggle('show'));

            item.classList.toggle('change');
        });
    });
}

function closeOutClick(btn) {
    const form = document.querySelectorAll(
        btn.getAttribute('data-selector')
    ).forEach((item) => {
        window.addEventListener('click', function(e){
            if (
                !btn.contains(e.target) && 
                !item.contains(e.target) && 
                btn.classList.contains('change')
            ){
                btn.classList.remove('change')
                item.classList.remove('show')
            }
        });
    });
}
