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
                    <h1 className="text-4xl font-bold mb-6 text-center">About This Project</h1>
                    <p className="text-lg mb-6">
                        This project is a modern full-stack web application built with a focus on speed, scalability, and smooth user experience. It combines powerful backend services with a sleek, animated frontend to deliver a seamless product.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
                    <ul className="list-disc list-inside mb-6 space-y-1">
                        <li><strong>Backend:</strong>Django – powering robust APIs and business logic.</li>
                        <li><strong>Frontend:</strong>React (with Vite) – providing a blazing-fast, modular, and developer-friendly interface.</li>
                        <li><strong>Styling & Animations:</strong> Tailwind CSS – ensuring a clean, responsive, and customizable design system. Framer Motion – adding smooth, interactive transitions for an engaging user experience.</li>
                        <li><strong>Caching & Queues:</strong>Redis – used for performance optimization and real-time data handling.</li>
                        <li><strong>Database:</strong>PostgreSQL (hosted on AWS) – delivering reliable, secure, and scalable data storage.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default About
