import React from "react";
import "../styles/contact.css"
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="h-screen w-full relative">
            <div className="contact">
                <Link className="cursor-default" to="/">
                    <MdArrowBackIosNew className="back w-7 h-7 mt-3"/>
                </Link>
                <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 m-5">
                    <h1 className="text-4xl font-bold mb-6 text-center">Про нас</h1>
                    <p className="text-lg mb-6">
                        Цей вебсайт було розроблено як навчальне завдання з практики для студентів спеціальності <strong>"Компʼютерні науки"</strong> Університету КРОК (м. Київ). Метою проєкту було створення сучасного full-stack застосунку з використанням актуальних технологій веброзробки.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">Над проєктом працювала команда:</h2>
                    <ul className="list-disc list-inside mb-6 space-y-1">
                        <li><strong>Гижко Богдан</strong></li>
                        <li><strong>Дідовець Данило</strong></li>
                        <li><strong>Демедовський Євген</strong></li>
                        <li><strong>Пархомчук Владислав</strong></li>
                    </ul>

                    <h2 className="text-2xl font-semibold mb-4">Використані технології:</h2>
                    <ul className="list-disc list-inside mb-6 space-y-1">
                        <li><strong>Django</strong> — як основа бекенду для обробки логіки, авторизації та роботи з базою даних.</li>
                        <li><strong>PostgreSQL</strong> — як надійна реляційна база даних.</li>
                        <li><strong>Redis</strong> — для кешування та обробки тимчасових даних.</li>
                        <li><strong>React</strong> — для побудови динамічного інтерфейсу користувача.</li>
                        <li><strong>Tailwind CSS</strong> — для швидкої та адаптивної стилізації UI.</li>
                        <li><strong>Framer Motion</strong> — для анімацій і плавних візуальних переходів.</li>
                    </ul>

                    <p className="text-lg mb-3">
                        Проєкт дозволив нам застосувати знання з програмування, баз даних, клієнт-серверної взаємодії та командної співпраці. Ми отримали цінний досвід створення повноцінного вебзастосунку, який відповідає сучасним підходам у розробці.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About