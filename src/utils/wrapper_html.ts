

const linkWrapperHtml = (type: string, url:string): HTMLElement => {
    //
    let htmlType: string;
    switch (type) {
        case "link":
        htmlType = 'a';
        break;
        default:
        htmlType = 'img';
        break;
    }
    //
    const html = document.createElement(htmlType);
        if(htmlType === 'a') {
        (html as HTMLAnchorElement).href = url;
        html.style.display = "block";
        html.style.width = "100%";
        html.style.height = "10px";
        html.textContent = url;
        html.style.color = "white";
        html.style.textDecorationColor = "white";
        }
    const wrapper = document.createElement('div');
    wrapper.style.height = "15px";
    wrapper.style.width = "95%";
    wrapper.style.display = "inline-block";
    wrapper.appendChild(html);
    return wrapper;
};

export default linkWrapperHtml