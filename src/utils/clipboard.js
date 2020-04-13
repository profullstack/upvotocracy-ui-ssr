const copyToClipboard = str => {
    if (typeof window === 'undefined' ) return;
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

export default copyToClipboard;