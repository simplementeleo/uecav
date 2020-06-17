const app = new Vue({
    el: '#app',
    data: {
        title: 'Control de Estudio',
        alert: false,
        alertt: false,
        students: [],
        teacher: false,
        user: {},
        table: localStorage.getItem('table'),
        search: '',
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
                    } else {
                        this.alert = true
                        setTimeout(() => {
                            this.alert = false
                        }, 1000)
                    }
                    break;
                case 3:
                    if (this.data.formSecondary.userOpsu != '' && this.data.formSecondary.passOpsu != '') {
                        this.steps.two = false
                        this.steps.three = true
                    } else {
                        this.alert = true
                        setTimeout(() => {
                            this.alert = false
                        }, 1000)
                    }
                    break;
                case 'done':
                    if (this.data.formPrimary.dni != '' && this.data.formPrimary.nombres != '' && this.data.formPrimary.apellidos != '' && this.data.formSecondary.userOpsu != '' && this.data.formSecondary.passOpsu != '' && this.data.formThird.email != '' && this.data.formThird.passEmail != '') {
                        this.steps.three = false
                        this.steps.four = true

                        axios.post(`https://uecav.herokuapp.com/api/student`, this.data)
                            .then((response) => {
                                console.log(response);
                                if (response.data.repeat) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Ya estas registrado...',
                                      })
                                }
                                this.all()
                            })
                            .catch((error) => {
                                console.log(error);
                            });

                    } else {
                        this.alert = true
                        setTimeout(() => {
                            this.alert = false
                        }, 1000)
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
        },
        login() {
            if (this.user.username === '@uecav' && this.user.password === '123456') {
                localStorage.setItem('table', 'true')
                // console.log('Entras')
                console.log(this.tableGet)
                this.teacher = false
                this.table = true
                this.user.username = ''
                this.user.password = ''
            } else {
                this.alertt = true
                setTimeout(() => {
                    this.alertt = false
                }, 1000)
            }
        },
        logout() {
            localStorage.removeItem('table')
            this.table = false
        },
        all() {
            axios.post(`https://uecav.herokuapp.com/api/all`)
                .then((response) => {
                    this.students = response.data
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        deleteItem(student) {
            // console.log(student._id)

            Swal.fire({
                title: '¿Desea eleminar este registro?',
                text: "No podrá revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar'
            }).then((result) => {
                if (result.value) {
                    axios.delete(`https://uecav.herokuapp.com/api/delete/${student._id}`)
                    .then((response) => {
                        if (response.data.dlt) this.all()
                        Swal.fire(
                            'Listo!',
                            'Registro eliminado exitosamente.',
                            'success'
                        )
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
            })
           
        },
        generatePdf() {

            var doc = new jsPDF('l', 'pt');

            var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
            doc.autoTable(res.columns, res.data, {
                margin: {
                    top: 80
                }
            });

            var header = function (data) {
                doc.setFontSize(18);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
                // doc.text("Testing Report", data.settings.margin.left, 50);
            };

            var options = {
                beforePageContent: header,
                margin: {
                    top: 80
                },
                // startY: doc.autoTableEndPosY() + 20
            };

            doc.autoTable(res.columns, res.data, options);

            doc.save("Datos graduandos - OPSU.pdf");
        }
    },
    computed: {
        stepOne() {
            return this.data.formPrimary.dni != '' && this.data.formPrimary.nombres != '' && this.data.formPrimary.apellidos ? true : false
        },
        stepTwo() {
            return this.data.formSecondary.userOpsu != '' && this.data.formSecondary.passOpsu != '' ? true : false
        },
        stepThree() {
            return this.data.formThird.email != '' && this.data.formThird.passEmail != '' ? true : false
        },
        filterStudents() {
            return this.students.filter(student => {
                return student.cedula.toString().match(this.search) || student.names.toLowerCase().match(this.search.toLowerCase()) || student.lastnames.toLowerCase().match(this.search.toLowerCase()) || student.username.toLowerCase().match(this.search.toLowerCase()) || student.passUser.toLowerCase().match(this.search.toLowerCase()) || student.email.toLowerCase().match(this.search.toLowerCase()) || student.passEmail.toLowerCase().match(this.search.toLowerCase())
            })
        },
        // tableGet(){
        //     return localStorage.getItem('table') == 'true' ? this.table = true : this.table = false
        // }
    },
    mounted() {
        this.all()
    },
})



window.addEventListener("load", function(event) {
   document.querySelector('#view').classList.remove('hide')
   document.querySelector('.load').classList.add('d-none')
});