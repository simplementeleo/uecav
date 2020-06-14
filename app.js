const app = new Vue({
    el: '#app',
    data: {
        title: 'Control de Estudio',
        alert: false,
        students: [],
        data: {
            formPrimary: {
                dni: '',
                nombres: '',
                apellidos: ''
            },
            formSecondary: {
                userOpsu: '',
                passOpsu: '',
            },
            formThird: {
                email: '',
                passEmail: '',
            },
        },
        steps: {
            one: true,
            two: false,
            three: false,
            four: false
        }
    },
    methods: {
        next(step) {
            switch (step) {
                case 2:
                    if (this.data.formPrimary.dni != '' && this.data.formPrimary.nombres != '' && this.data.formPrimary.apellidos != '') {
                        this.steps.one = false
                        this.steps.two = true
                    }else{
                        this.alert = true
                        setTimeout(()=> {
                            this.alert = false
                        },1000)
                    }
                    break;
                case 3:
                    if (this.data.formSecondary.userOpsu != '' && this.data.formSecondary.passOpsu != '') {
                        this.steps.two = false
                        this.steps.three = true
                    }else{
                        this.alert = true
                        setTimeout(()=> {
                            this.alert = false
                        },1000)
                    }
                    break;
                case 'done':
                    if (this.data.formPrimary.dni != '' && this.data.formPrimary.nombres != '' && this.data.formPrimary.apellidos != '' && this.data.formSecondary.userOpsu != '' && this.data.formSecondary.passOpsu != '' && this.data.formThird.email != '' && this.data.formThird.passEmail != '') {
                        console.log('Datos enviados')
                        this.steps.three = false
                        this.steps.four = true
                    }else{
                        this.alert = true
                        setTimeout(()=> {
                            this.alert = false
                        },1000)
                    }
                    break;
            }
        },
        previous(step) {
            switch (step) {
                case 1:
                    this.steps.one = true
                    this.steps.two = false
                    this.steps.three = false
                    break;
                case 2:
                    this.steps.one = false
                    this.steps.two = true
                    this.steps.three = false
                    break;
            }
        }
    },
    computed: {
        stepOne() {
            return this.data.formPrimary.dni != '' && this.data.formPrimary.nombres != '' && this.data.formPrimary.apellidos ? true: false
        },
        stepTwo() {
            return this.data.formSecondary.userOpsu != '' && this.data.formSecondary.passOpsu != '' ? true : false
        },
        stepThree() {
            return this.data.formThird.email != '' && this.data.formThird.passEmail != '' ? true : false
        },
    }
})