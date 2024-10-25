const apiUrl = process.env.REACT_APP_API_URL;

export const placeholderImage = (layoutElements) => {
    let largestZIndex = 4;
    layoutElements.forEach(el => {
        if (el.zIndex > largestZIndex) {
            largestZIndex = el.zIndex
        }
    });

    const image =             {
        id: "layout_placeholder___62efa17d", 
        url: `${apiUrl}/layout_placeholder___62efa17d.png`,
        size: {width: 409, height: 409},
        type: "image", 
        title: "layout_placeholder___62efa17d", 
        zIndex: largestZIndex + 1, 
        position: {x: 205, y: 111}, 
        displayTitle: "Placeholder Image",
        conditions: {
            isForNewSubscriber: true,
            isForResubscription: true,
            isForGiftSub: true
        }
    }
    return image
}