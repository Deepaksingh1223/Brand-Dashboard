module.exports={content:['./app/**/*.{js,jsx}','./components/**/*.{js,jsx}'],
theme:{extend:{fontFamily:{sans:['var(--font-inter)','system-ui','sans-serif']},
keyframes:{fadeUp:{'0%':{opacity:0,transform:'translateY(8px)'},'100%':{opacity:1,transform:'none'}},slideIn:{'0%':{transform:'translateX(100%)'},'100%':{transform:'none'}},fade:{'0%':{opacity:0},'100%':{opacity:1}}},
animation:{fadeUp:'fadeUp .45s ease-out both',slideIn:'slideIn .3s cubic-bezier(.16,1,.3,1)',fade:'fade .2s ease-out'}}},plugins:[]}
