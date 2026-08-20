import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function HelpPage() {
  const faqs = [
    {
      question: "What is satellite imagery?",
      answer: "Satellite imagery refers to pictures of the Earth taken from spacecraft orbiting our planet. These images show fields, forests, water bodies, and buildings from above, helping us see changes over time."
    },
    {
      question: "What can this system tell me?",
      answer: "This system can help you notice changes in your chosen areas, such as whether vegetation has grown or dried up, if water bodies have shrunk or expanded, and if new buildings or roads have appeared."
    },
    {
      question: "How do I select an area?",
      answer: "Go to the Home screen and click 'Choose from map'. A simple map view will appear where you can search for a location by name or draw a box around the field/area you are interested in monitoring."
    },
    {
      question: "How do I ask questions?",
      answer: "Once the satellite image is loaded, you will see a text box below it. You can type questions in simple English, Hindi, or Marathi, such as 'Is my crops' area green?' or 'Where did water levels go down?'"
    },
    {
      question: "What do the results mean?",
      answer: "The system provides a list of simple findings (like 'Vegetation decreased'). Green badges mean completed or positive changes, blue badges show helpful details, amber represents processing, and red indicates errors or warnings."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-brand-neutral-900">Help & Frequently Asked Questions</h3>
        <p className="text-sm md:text-base text-brand-neutral-700 mt-2">
          If you are new to Earth Observation or monitoring satellite imagery, read these simple questions to get started.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm md:text-base font-semibold text-brand-green-700">
                {faq.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 px-4 text-sm text-brand-neutral-900 leading-relaxed">
              {faq.answer}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
