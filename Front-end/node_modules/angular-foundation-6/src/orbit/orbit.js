function orbit($element) {
    'ngInject';
    this.container = null;
    this.$element = $element;
    $element.css({ overflow: 'hidden' });
    this.setContainer = (container_) => {
        this.container = container_;
    };
}

function orbitBullets($element) {
    'ngInject';
    const vm = this;
}

function orbitContainer($element, $interval, $scope, $swipe) {
    'ngInject';
    this.slides = [];
    this.currentIdx = 0;
    this.skipInterval = true;
    $element.css({ position: 'relative' });
    this.addSlide = (slide) => {
        this.slides.push(slide);
        for (const slide of this.slides) {
            slide.element.css({ width: `${100 / this.slides.length}%` });
        }
        $element.css({ width: `${this.slides.length * 100}%` });
    };
    this.activateState = (index) => {
        this.currentIdx = index;
        const pct = 100 * this.currentIdx / this.slides.length;
        $element.css({ transform: `translateX(${-pct}%)` });
    };
    this.stopAutoPlay = () => {
        $interval.cancel(this.autoSlider);
        this.autoSlider = null;
    };
    this.restartTimer = () => {
        this.stopAutoPlay();
        this.autoSlider = $interval(() => {
            this.activateState(++this.currentIdx % this.slides.length);
        }, 5000);
    };
    $element.on('mouseenter', this.stopAutoPlay);
    $element.on('mouseleave', this.restartTimer);
    this.$onDestroy = () => {
        this.stopAutoPlay();
        $element.off('mouseenter', this.stopAutoPlay);
        $element.off('mouseleave', this.restartTimer);
    };

    let startPos = null;
    let nextIdx = this.currentIdx;
    const vm = this;

    $swipe.bind($element, {
        start: (pos) => {
            $element.addClass('touching');
            this.stopAutoPlay();
            startPos = pos;
        },
        move: (pos) => {
            const dist = startPos.x - pos.x;
            const width = this.orbit.$element[0].offsetWidth;
            const pctDist = 100 * dist / width;
            const lastPct = 100 * this.currentIdx / this.slides.length;
            const pct = lastPct + (pctDist / this.slides.length);
            const roundFn = pos.x > startPos.x ? Math.floor : Math.ceil;

            nextIdx = roundFn(pct / (100 / this.slides.length));

            $element.css({ transform: `translateX(${-pct}%)` });
        },
        end: (pos) => {
            $element.removeClass('touching');

            if (nextIdx >= this.slides.length) {
                nextIdx = this.slides.length - 1;
            } else if (nextIdx < 0) {
                nextIdx = 0;
            }

            this.activateState(nextIdx);
            this.restartTimer();
            $scope.$apply();
        },
        cancel: () => {
            this.restartTimer();
            $element.removeClass('touching');
        },
    });
    this.$onInit = () => {
        this.orbit.setContainer(this);
        // this.restartTimer();
        $scope.$watch(() => this.currentIdx, this.restartTimer);
    };
}
function orbitSlide($element) {
    'ngInject';
    const vm = this;
    // transform: translateX(-50%);
    $element.css({ overflow: 'hidden', float: 'left', position: 'relative' });
    this.$onInit = () => {
        vm.orbitContainer.addSlide({ element: $element });
    };
}

angular.module('mm.foundation.orbit', ['ngTouch'])
.directive('orbit', () => ({
    scope: {},
    restrict: 'C',
    controller: orbit,
}))
.directive('orbitContainer', () => ({
    scope: {},
    restrict: 'C',
    require: { orbit: '^^orbit' },
    controller: orbitContainer,
    controllerAs: 'vm',
    bindToController: true,
}))
.directive('orbitSlide', () => ({
    scope: {},
    restrict: 'C',
    require: { orbitContainer: '^^orbitContainer' },
    controller: orbitSlide,
    controllerAs: 'vm',
    bindToController: true,
}))
.directive('orbitBullets', () => ({
    scope: {},
    restrict: 'EC',
    require: { orbit: '^^orbit' },
    controller: orbitBullets,
    controllerAs: 'vm',
    bindToController: true,
    template: `
        <button
            ng-click="vm.orbit.container.activateState($index)"
            ng-repeat="slide in vm.orbit.container.slides"
            ng-class="{'is-active': $index === vm.orbit.container.currentIdx}">
            </button>
    `,
}));
