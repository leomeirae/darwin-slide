import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ChatBubble from '@/components/chat-bubble'
import { MainNav } from '@/components/main-nav'
import { HeroActions } from '@/components/hero-actions'
import { Button } from '@/components/ui/button'

const PLANS = [
  {
    name: 'Plano Gratuito',
    description: 'Perfeito para começar',
    price: 'R$0',
    features: [
      'Aumente o engajamento com respostas direcionadas',
      'Automatize respostas a comentários para melhorar a interação com o público',
      'Transforme seguidores em clientes com mensagens segmentadas',
    ],
    cta: 'Comece Agora',
  },
  {
    name: 'Plano Smart IA', 
    description: 'Recursos avançados para usuários experientes',
    price: 'R$49',
    features: [
      'Todos os recursos do Plano Gratuito',
      'Geração de respostas com inteligência artificial',
      'Análises e insights avançados',
      'Suporte prioritário ao cliente',
      'Opções de personalização de marca',
    ],
    cta: 'Comece Agora',
  },
]

export default function Home() {
  return (
    <main>
      <ChatBubble />
      <section className="relative bg-gradient-to-b from-slate-900 via-blue-900 to-bg">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="relative">
          <div className="container px-4 py-8">
            <MainNav />

            <div className="mx-auto mt-16 max-w-3xl text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Aumente seu engajamento no Instagram com o IAGO
              </h1>

              <p className="mt-6 text-lg text-blue-200">
                IAGO revoluciona a forma como você se conecta com seu público no
                Instagram. Automatize respostas, aumente o engajamento de forma simples e
                transforme cada interação em oportunidades valiosas para o seu negócio.
              </p>

              <HeroActions />
            </div>
            <div className="relative h-40 md:h-80 w-full mt-10">
              <Image
                src="/Ig-creators.png"
                alt="Community member"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="container w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Selecione o plano perfeito para você
            </h2>
            <p className="max-w-[900px] text-muted-foreground">
              Escolha o plano que melhor atende às suas necessidades e comece a
              aumentar o engajamento no Instagram de forma inteligente e eficiente.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 md:gap-8">
            {PLANS.map((plan, index) => (
              <Card
                key={index}
                className="flex flex-col justify-between"
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      /mês
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center"
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link href="/dashboard" className="w-full text-white">
                      {plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
