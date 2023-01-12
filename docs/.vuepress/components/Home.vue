<script>
export default {
    data() {
        return {};
    },
    created(){
    },
    methods:{
        gotoTag(){
            this.$router.push('/tag/')
        }
    }
};
</script>

<template>
    <div id="home">
        <p>
            <span class="hello gradual">Hello~</span>
        </p>
        <p class="context">
            这里是<span class="gradual">大米饭</span>的笔记本，主要用于存放本人平时的学习笔记📑
        </p>
        <button class="start" @click="gotoTag">开始🎉</button>
    </div>
</template>

<style scoped>
p {
    font-family: "PT Serif";
}
.gradual {
    background-image: linear-gradient(
        300deg,
        hsl(315deg 73% 10%) 0%,
        hsl(321deg 75% 14%) 6%,
        hsl(329deg 77% 19%) 11%,
        hsl(335deg 80% 23%) 17%,
        hsl(342deg 83% 28%) 22%,
        hsl(349deg 85% 32%) 28%,
        hsl(356deg 88% 37%) 33%,
        hsl(3deg 90% 41%) 39%,
        hsl(10deg 93% 45%) 44%,
        hsl(17deg 95% 50%) 50%,
        hsl(21deg 96% 52%) 56%,
        hsl(24deg 97% 55%) 61%,
        hsl(28deg 97% 57%) 67%,
        hsl(32deg 97% 59%) 72%,
        hsl(36deg 98% 61%) 78%,
        hsl(39deg 99% 63%) 83%,
        hsl(43deg 99% 65%) 89%,
        hsl(46deg 100% 68%) 94%,
        hsl(50deg 100% 70%) 100%
    );
    color: transparent;
    -webkit-background-clip: text;
    font-weight: 600;
    text-shadow: none;
}
.hello {
    font-size: 3rem;
}


.context {
    font-size: 1.25rem;
    text-shadow: 2px 3px 5px #c1c1c1;
}
.start {
    outline: none;
    border: none;
    padding:0.5rem 0.8rem;
    font-size: 1.25rem;
    border-radius: 10px;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    background-color: #123123;
    transition: all 0.3s ease;
}
.start:hover {
    box-shadow: 0px 0px 10px #111;
}
</style>
